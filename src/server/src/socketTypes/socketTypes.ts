import { LiveListenerData, MessageData, SongData, SongInterruptData } from './socketDataTypes';

// Types the messages from the server to the client
export interface ServerToClientEvents {
  liveListener: (data: LiveListenerData) => void;
  message: (data: MessageData) => void;
  pauseSong: (data: SongInterruptData) => void;
  resumeSong: (data: SongInterruptData) => void;
  newSong: (data: SongData) => void;
}

// Types the messages from the client to the server
export interface ClientToServerEvents {
  message: (data: MessageData) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  newSong: (data: SongData) => void;
}

// Types the inter-server communication using io.serverSideEmit('ping')
export interface InterServerEvents {}

// Types the socket.data object
export interface SocketData {
  // userId: string
}
