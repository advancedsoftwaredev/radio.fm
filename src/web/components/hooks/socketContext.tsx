import React, { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageData, SongData, SongInterruptData } from '../../../server/src/socketTypes/socketDataTypes';
import { ServerToClientEvents, ClientToServerEvents } from '../../../server/src/socketTypes/socketTypes';
import { api } from '../../apiInterface';
import { ApiSongInfo } from '../../apiTypes/song';

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents> | null;

interface SocketContextData {
  socket: SocketType;
  messages: MessageData[];
  playing: Boolean;
  time: Number;
}

const SocketContext = React.createContext<SocketContextData | null>(null);

export function SocketContextProvider(props: { children: any }) {
  const [socket, setSocket] = useState<SocketType>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [playing, setPlaying] = useState<Boolean>(false);
  const [time, setTime] = useState<Number>(0);
  const [song, setSong] = useState<ApiSongInfo | null>(null);

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
        setPlaying(true);
        setTime(0);
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
      }
    };
  }, [socket]);

  return <SocketContext.Provider value={{ socket, messages, time, playing }}>{props.children}</SocketContext.Provider>;
}

export function useSocketData() {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('Socket context being accessed outside the provider');
  }
  return socket;
}
