import React, { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  LiveListenerData,
  MessageData,
  SongData,
  CurrentSongData,
  SongInterruptData,
} from '../../../server/src/socketTypes/socketDataTypes';
import { ServerToClientEvents, ClientToServerEvents } from '../../../server/src/socketTypes/socketTypes';
import { ApiSongInfo } from '../../apiTypes/song';
import { useSongHandler } from './songContext';
import { useUserData } from './userContext';

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents> | null;

interface SocketContextData {
  messages: MessageData[];
}

interface SocketInterfaceContext {
  socket: SocketType;
  sendMessage: (data: MessageData) => void;
  requestNextSong: () => void;
  newSong: (data: SongData) => void;
  getTime: () => void;
}

const SocketContext = React.createContext<SocketContextData | null>(null);
const SocketInterfaceContext = React.createContext<SocketInterfaceContext | null>(null);

const connectToSocket = (namespace: string = '/') =>
  io(namespace, { withCredentials: true, path: '/socket.io/socket.io' });

export function SocketContextProvider(props: { children: any }) {
  const [socket, setSocket] = useState<SocketType>(null);
  const [adminSocket, setAdminSocket] = useState<SocketType>(null);

  const [messages, setMessages] = useState<MessageData[]>([]);

  const user = useUserData();
  const songHandler = useSongHandler();

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
        songHandler?.setListenerData(data);
      });

      socket.on('newSong', async (data: CurrentSongData) => {
        songHandler?.setSongData(data);
        requestNextSong();
      });

      socket.on('nextSong', async (data: ApiSongInfo) => {
        songHandler?.setNextSongData(data);
      });

      socket.on('getTime', async (data: SongInterruptData) => {
        songHandler?.setTimeData(data);
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
  const getTime = () => socket?.emit('getTime');

  const socketInterface: SocketInterfaceContext = {
    socket,

    // Guest functions
    sendMessage: (data: MessageData) => socket?.emit('message', data),
    requestNextSong,
    getTime,

    // Admin functions
    newSong: (data: SongData) => adminSocket?.emit('newSong', data),
  };

  return (
    <SocketContext.Provider value={{ messages }}>
      <SocketInterfaceContext.Provider value={socketInterface}>{props.children}</SocketInterfaceContext.Provider>
    </SocketContext.Provider>
  );
}

export const useSocketInterface = () => useContext(SocketInterfaceContext);
export const useSocketData = () => useContext(SocketContext);
