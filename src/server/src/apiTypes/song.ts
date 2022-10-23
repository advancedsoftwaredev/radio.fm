import type { SongLog } from '@prisma/client';

export interface SongByIdInput {
  id: string;
}

export interface SongByIdInput {
  id: string;
}

export interface ApiCreateAlbumArtInfo {
  title: string;
}

export interface ApiCreateAlbumArtReturn {
  albumImageUrl: string;
}

export interface ApiCreateSongInfo {
  title: string;
  description: string;
  artist: string;
  albumImageUrl: string;
}

export interface ApiEditSongInfo {
  id: string;
  title: string;
  description: string;
  artist: string;
  albumImageUrl: string;
}

export interface ApiSongInfo {
  song: JSX.Element;
  id: string;
  title: string;
  description: string;
  artist: string;
  albumImageUrl: string;
  songMediaUrl: string;
  length: number;
}

export type SongLogWithSong = SongLog & {
  song: ApiSongInfo;
};

export type SongLogWithLike = SongLogWithSong & {
  liked: boolean;
};
