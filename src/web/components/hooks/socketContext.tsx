import React, { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  LiveListenerData,
  MessageData,
  SongData,
  SongInterruptData,
} from '../../../server/src/socketTypes/socketDataTypes';
import { ServerToClientEvents, ClientToServerEvents } from '../../../server/src/socketTypes/socketTypes';
import { api } from '../../apiInterface';
import { ApiSongInfo } from '../../apiTypes/song';
import { UserContext, useUserData } from './userContext';

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents> | null;

type SongInfo = ApiSongInfo | null;

interface SocketContextData {
  messages: MessageData[];
  playing: Boolean;
  time: Number;
  song: SongInfo;
  listenerCount: number;
}

interface SocketInterfaceContext {
  socket: SocketType;
  sendMessage: (data: MessageData) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  newSong: (data: SongData) => void;
}

const SocketContext = React.createContext<SocketContextData | null>(null);
const SocketInterfaceContext = React.createContext<SocketInterfaceContext | null>(null);

const connectToSocket = (namespace: string = '/') =>
  io(namespace, { withCredentials: true, path: '/socket.io/socket.io' });

export function SocketContextProvider(props: { children: any }) {
  const [socket, setSocket] = useState<SocketType>(null);
  const [adminSocket, setAdminSocket] = useState<SocketType>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [playing, setPlaying] = useState<Boolean>(false);
  const [time, setTime] = useState<Number>(0);
  const [song, setSong] = useState<SongInfo>(null);
  const [listenerCount, setListenerCount] = useState<number>(0);

  const user = useContext(UserContext);

  useEffect(() => {
    const newSocket = connectToSocket();
    let newAdminSocket: SocketType = null;
    if (user?.role === 'ADMIN') {
      newAdminSocket = connectToSocket('/admin');
    } else {
      if (adminSocket) {
        adminSocket.close();
      }
    }
    setAdminSocket(newAdminSocket);
    setSocket(newSocket);
    return () => {
      newAdminSocket?.close();
      newSocket.close();
    };
  }, [setSocket, user]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', async () => {
        console.log('successfully connected to server socket.io.');
      });

      socket.on('message', async (data: MessageData) => {
        setMessages((current) => {
          const newMessages = JSON.parse(JSON.stringify(current));
          newMessages.push(data);
          return newMessages;
        });
      });

      socket.on('liveListener', async (data: LiveListenerData) => {
        setListenerCount(data.liveListenerCount);
      });

      socket.on('pauseSong', (data: SongInterruptData) => {
        setPlaying(false);
        setTime(data.time);
      });

      socket.on('resumeSong', (data: SongInterruptData) => {
        setPlaying(true);
        setTime(data.time);
      });

      socket.on('newSong', async (data: SongData) => {
        setSong(await api.song.getById({ id: data.songId }));
        setTime(data.time ?? 0);
        setPlaying(true);
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('message');
        socket.off('pauseSong');
        socket.off('resumeSong');
        socket.off('newSong');
        socket.off('liveListener');
      }
    };
  }, [socket, adminSocket]);

  const socketInterface: SocketInterfaceContext = {
    socket,

    // Guest functions
    sendMessage: (data: MessageData) => socket?.emit('message', data),

    // Admin functions
    pauseSong: () => adminSocket?.emit('pauseSong'),
    resumeSong: () => adminSocket?.emit('resumeSong'),
    newSong: (data: SongData) => adminSocket?.emit('newSong', data),
  };

  return (
    <SocketContext.Provider value={{ messages, time, playing, song, listenerCount }}>
      <SocketInterfaceContext.Provider value={socketInterface}>{props.children}</SocketInterfaceContext.Provider>
    </SocketContext.Provider>
  );
}

export const useSocketInterface = () => useContext(SocketInterfaceContext);
export const useSocketData = () => useContext(SocketContext);
