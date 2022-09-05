import { ApiSongInfo } from '../../../web/apiTypes/song';

export interface LiveListenerData {
  liveListenerCount: number;
}

export interface MessageData {
  time: Date;
  username: string;
  msg: string;
}

export interface SongInterruptData {
  time: number;
}

export interface SongData {
  songId: string;
  time?: number;
}

export interface CurrentSongData {
  song: ApiSongInfo;
  time?: number;
  finished: boolean;
}
