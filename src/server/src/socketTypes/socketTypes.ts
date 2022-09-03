import { ApiSongInfo } from '../../../web/apiTypes/song';
import { LiveListenerData, MessageData, SongData, CurrentSongData } from './socketDataTypes';

// Types the messages from the server to the client
export interface ServerToClientEvents {
  liveListener: (data: LiveListenerData) => void;
  message: (data: MessageData) => void;
  newSong: (data: CurrentSongData) => void;
  nextSong: (data: ApiSongInfo) => void;
}

// Types the messages from the client to the server
export interface ClientToServerEvents {
  message: (data: MessageData) => void;
  requestNextSong: () => void;
  newSong: (data: SongData) => void;
}

// Types the inter-server communication using io.serverSideEmit('ping')
export interface InterServerEvents {}

// Types the socket.data object
export interface SocketData {
  // userId: string
}
