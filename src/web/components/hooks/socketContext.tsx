import React, { useCallback, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import type { ApiSongInfo } from '../../../server/src/apiTypes/song';
import type {
  CurrentSongData,
  LiveListenerData,
  MessageData,
  SongData,
  SongInterruptData,
} from '../../../server/src/socketTypes/socketDataTypes';
import type { ClientToServerEvents, ServerToClientEvents } from '../../../server/src/socketTypes/socketTypes';
import { getPublicConfig } from '../../config';
import { useSongHandler } from './songContext';
import { useUserData } from './userContext';

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents> | null;

interface SocketContextData {
  messages: IMessage[];
}

interface SocketInterfaceContext {
  socket: SocketType;
  sendMessage: (data: MessageData) => void;
  requestNextSong: () => void;
  newSong: (data: SongData) => void;
  getTime: () => void;
}

type IMessage = MessageData & {
  id: string;
};

const SocketContext = React.createContext<SocketContextData | null>(null);
const SocketInterfaceContext = React.createContext<SocketInterfaceContext | null>(null);

const connectToSocket = (namespace = '/') => {
  return io(getPublicConfig().serverUrl + namespace, { withCredentials: true });
};

export function SocketContextProvider(props: { children: any }) {
  const [socket, setSocket] = useState<SocketType>(null);
  const [adminSocket, setAdminSocket] = useState<SocketType>(null);

  const [messages, setMessages] = useState<IMessage[]>([]);

  const user = useUserData();
  const songHandler = useSongHandler();

  const requestNextSong = useCallback(() => socket?.emit('requestNextSong'), [socket]);
  const getTime = () => socket?.emit('getTime');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSocket, user]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', async () => {
        console.log('successfully connected to server socket.io.');
      });

      socket.on('message', async (data: MessageData) => {
        setMessages((current) => {
          const newMessages = JSON.parse(JSON.stringify(current));

          newMessages.push({
            ...data,
            id: uuidv4(),
          });

          return newMessages.map((msg: IMessage) => ({ ...msg, time: new Date(msg.time) }));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, adminSocket]);

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
