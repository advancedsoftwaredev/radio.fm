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

export function SocketContextProvider(props: { children: any }) {
  const [socket, setSocket] = useState<SocketType>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [playing, setPlaying] = useState<Boolean>(false);
  const [time, setTime] = useState<Number>(0);
  const [song, setSong] = useState<SongInfo>(null);
  const [listenerCount, setListenerCount] = useState<number>(0);

  useEffect(() => {
    const newSocket = io(':8080');
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
  }, [socket]);

  const socketInterface: SocketInterfaceContext = {
    socket,

    // Guest functions
    sendMessage: (data: MessageData) => socket?.emit('message', data),

    // Admin functions
    pauseSong: () => socket?.emit('pauseSong'),
    resumeSong: () => socket?.emit('resumeSong'),
    newSong: (data: SongData) => socket?.emit('newSong', data),
  };

  return (
    <SocketContext.Provider value={{ messages, time, playing, song, listenerCount }}>
      <SocketInterfaceContext.Provider value={socketInterface}>{props.children}</SocketInterfaceContext.Provider>
    </SocketContext.Provider>
  );
}

export function useSocketData() {
  return handleSocketHook(SocketContext);
}

export function useSocketInterface() {
  return handleSocketHook(SocketInterfaceContext);
}

function handleSocketHook(context: React.Context<any>) {
  const socket = useContext(context);
  if (!socket) {
    throw new Error('Socket context being accessed outside the provider');
  }
  return socket;
}
