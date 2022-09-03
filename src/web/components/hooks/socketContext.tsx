import React, { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  LiveListenerData,
  MessageData,
  SongData,
  CurrentSongData,
} from '../../../server/src/socketTypes/socketDataTypes';
import { ServerToClientEvents, ClientToServerEvents } from '../../../server/src/socketTypes/socketTypes';
import { api } from '../../apiInterface';
import { ApiSongInfo } from '../../apiTypes/song';
import { UserContext, useUserData } from './userContext';

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents> | null;

type SongInfo = ApiSongInfo | null;

interface SocketContextData {
  messages: MessageData[];
  time: Number;
  song: SongInfo;
  audio: HTMLAudioElement | null;
  listenerCount: number;
}

interface SocketInterfaceContext {
  socket: SocketType;
  sendMessage: (data: MessageData) => void;
  requestNextSong: () => void;
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
  const [time, setTime] = useState<Number>(0);
  const [song, setSong] = useState<SongInfo>(null);
  const [nextSong, setNextSong] = useState<SongInfo>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [nextAudio, setNextAudio] = useState<HTMLAudioElement | null>(null);
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

      socket.on('newSong', async (data: CurrentSongData) => {
        if (!data) {
          return;
        }
        if (!song) {
          setSong(data.song);
          setAudio(new Audio(data.song.songMediaUrl));
        } else {
          setSong(nextSong);
          setAudio(nextAudio);
        }
        setTime(data.time ?? 0);
        requestNextSong();
      });

      socket.on('nextSong', async (data: ApiSongInfo) => {
        setNextSong(data);
        setNextAudio(new Audio(data.songMediaUrl));
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('message');
        socket.off('newSong');
        socket.off('liveListener');
        socket.off('nextSong');
      }
    };
  }, [socket, adminSocket]);

  const requestNextSong = () => socket?.emit('requestNextSong');

  const socketInterface: SocketInterfaceContext = {
    socket,

    // Guest functions
    sendMessage: (data: MessageData) => socket?.emit('message', data),
    requestNextSong,

    // Admin functions
    newSong: (data: SongData) => adminSocket?.emit('newSong', data),
  };

  return (
    <SocketContext.Provider value={{ messages, time, song, audio, listenerCount }}>
      <SocketInterfaceContext.Provider value={socketInterface}>{props.children}</SocketInterfaceContext.Provider>
    </SocketContext.Provider>
  );
}

export const useSocketInterface = () => useContext(SocketInterfaceContext);
export const useSocketData = () => useContext(SocketContext);
