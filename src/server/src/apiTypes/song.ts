export interface SongByIdInput {
  id: string;
}

export interface ApiSongInfo {
  id: string;
  title: string;
  description: string;
  artist: string;
  albumImageUrl: string;
  songMediaUrl: string;
  length: number;
  removed: boolean;
}
