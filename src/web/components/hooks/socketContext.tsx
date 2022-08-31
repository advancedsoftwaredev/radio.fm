import React, { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../../../server/src/socketTypes/socketTypes';

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents> | null;

interface SocketContextData {
  socket: SocketType;
}

const SocketContext = React.createContext<SocketContextData | null>(null);

export function SocketContextProvider(props: { children: any }) {
  const [socket, setSocket] = useState<SocketType>(null);

  useEffect(() => {
    const newSocket = io(':8080', { withCredentials: true });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', async () => {
        console.log('successfully connected to server socket.io.');
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
      }
    };
  }, [socket]);

  return <SocketContext.Provider value={{ socket }}>{props.children}</SocketContext.Provider>;
}

export function useSocketData() {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('Socket context being accessed outside the provider');
  }
  return socket;
}
