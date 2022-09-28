export interface SongByIdInput {
  id: string;
}

export interface SongByIdInput {
  id: string;
}

export interface ApiCreateSongInfo {
  title: string;
  description: string;
  artist: string;
  albumImageUrl: string;
}

export interface ApiSongInfo {
  id: string;
  title: string;
  description: string;
  artist: string;
  albumImageUrl: string;
  songMediaUrl: string;
  length: number;
}
