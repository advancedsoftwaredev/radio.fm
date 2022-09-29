import { prisma } from '../../utils/prisma';

interface SongData {
  title: string;
  description: string;
  albumImageUrl: string;
  songMediaUrl: string;
  artist: string;
  length: number;
}

// FIXME: In the future, when we add admin endpoints, this should use the endpoint to create songs.
export async function insertTestSong(data: SongData) {
  return await prisma.song.create({
    data: {
      title: data.title,
      description: data.description,
      albumImageUrl: data.albumImageUrl,
      songMediaUrl: data.songMediaUrl,
      artist: data.artist,
      length: data.length,
    },
  });
}
