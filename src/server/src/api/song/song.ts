import type { Song } from '@prisma/client';
import getAudioDurationInSeconds from 'get-audio-duration';
import { Readable } from 'stream';

import type { ApiSongInfo, SongByIdInput } from '../../apiTypes/song';
import { prisma } from '../../utils/prisma';
import { authenticatedRouter } from '../../utils/routers';
import { NotFoundError } from '../errors';

export const PublicSongRouter = authenticatedRouter('guest');

PublicSongRouter.post<SongByIdInput, ApiSongInfo>('/song-info', async (req) => {
  const song: Song | null = await getSongById(req.body.id);
  if (!song) {
    throw new NotFoundError('No song found with that Id');
  }
  return mapSongToApiSong(song);
});

PublicSongRouter.get<ApiSongInfo[]>('/all-songs', async (req) => {
  const songs = await prisma.song.findMany();
  return songs.map(mapSongToApiSong);
});

export const AdminSongRouter = authenticatedRouter('admin');

AdminSongRouter.post<SongByIdInput, {}>('/delete-song', async (req) => {
  const song: Song | null = await getSongById(req.body.id);
  if (!song) {
    throw new NotFoundError('No song found with that Id');
  }
  await prisma.song.delete({
    where: {
      id: req.body.id,
    },
  });
  return {};
});

AdminSongRouter.upload<{}, ApiSongInfo>('/upload-song', async (req, file) => {
  // Convert file stream into a buffer
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    file.on('data', (chunk) => chunks.push(chunk));
    file.on('end', () => resolve(Buffer.concat(chunks)));
    file.on('error', reject);
  });

  // Yes, this means the song is stored in ram during processing, so large songs might use a lot of ram.

  // Use ffprobe to get the song duration
  const duration = await getAudioDurationInSeconds(Readable.from(buffer));

  // TODO: complete this function
  throw new Error('Not implemented');

  // Save the song to the database
  // const song = await prisma.song.create({
  //   data: {
  //     duration,
  //   },
  // });
  // return mapSongToApiSong(song);
});

export const getSongById = async (songId: string) => await prisma.song.findUnique({ where: { id: songId } });

export function mapSongToApiSong(song: Song): ApiSongInfo {
  return {
    id: song.id,
    title: song.title,
    description: song.description,
    artist: song.artist,
    albumImageUrl: song.albumImageUrl,
    songMediaUrl: song.songMediaUrl,
    length: song.length,
  };
}
