import type { Song } from '@prisma/client';
import fs from 'fs';
import getAudioDurationInSeconds from 'get-audio-duration';

import type {
  ApiCreateAlbumArtInfo,
  ApiCreateAlbumArtReturn,
  ApiCreateSongInfo,
  ApiEditSongInfo,
  ApiSongInfo,
  SongByIdInput,
} from '../../apiTypes/song';
import { env } from '../../env';
import songQueueHandler from '../../songQueueHandler';
import { prisma } from '../../utils/prisma';
import { getQueueLength } from '../../utils/queue';
import { authenticatedRouter } from '../../utils/routers';
import { audioStorage, imageStorage } from '../../utils/storage_interface';
import { makeTempFileFromStream } from '../../utils/tempfile';
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

  const queueRequiresReset = await songQueueHandler.checkInQueue(song.id);

  await prisma.$transaction([
    prisma.songLog.deleteMany({ where: { songId: req.body.id } }),
    prisma.likedSong.deleteMany({ where: { songId: req.body.id } }),
    prisma.songManagementLog.deleteMany({ where: { songId: req.body.id } }),
    prisma.queue.deleteMany({ where: { songId: req.body.id } }),
    prisma.song.delete({ where: { id: req.body.id } }),
  ]);

  if (queueRequiresReset) {
    void songQueueHandler.restartQueue();
  }

  return {};
});

// Purely for upload a file and giving back the filename
AdminSongRouter.upload<ApiCreateAlbumArtInfo, ApiCreateAlbumArtReturn>('/upload-art', async (req, file) => {
  const partial = await imageStorage.uploadFile(file, req.body.title);

  return {
    albumImageUrl: partial,
  };
});

AdminSongRouter.upload<ApiCreateSongInfo, ApiSongInfo>('/upload-song', async (req, file) => {
  // Write the song to a temp file
  const tempfile = await makeTempFileFromStream(file, '.mp3');

  // Use ffprobe to get the song duration
  const duration = await getAudioDurationInSeconds(tempfile);

  const partial = await audioStorage.uploadFile(fs.createReadStream(tempfile), req.body.title);

  // Clean up the temporary file
  await fs.promises.rm(tempfile);

  // Save the song to the database
  const song = await prisma.song.create({
    data: {
      albumImageUrl: req.body.albumImageUrl,
      artist: req.body.artist,
      description: req.body.description,
      length: Math.round(duration),
      title: req.body.title,
      songMediaUrl: partial,
    },
  });

  if ((await getQueueLength()) === 0 && process.env.NODE_ENV !== 'test') {
    void songQueueHandler.restartQueue();
  }

  return mapSongToApiSong(song);
});

AdminSongRouter.post<ApiEditSongInfo, ApiSongInfo>('/edit-song', async (req, file) => {
  const song = await prisma.song.update({
    where: { id: req.body.id },
    data: {
      albumImageUrl: req.body.albumImageUrl,
      artist: req.body.artist,
      description: req.body.description,
      title: req.body.title,
    },
  });

  return mapSongToApiSong(song);
});

export const getSongById = async (songId: string) => await prisma.song.findUnique({ where: { id: songId } });

export function mapSongToApiSong(song: Song): ApiSongInfo {
  return {
    id: song.id,
    title: song.title,
    description: song.description,
    artist: song.artist,
    length: song.length,

    albumImageUrl: `${env.serverUrl}/images/${song.albumImageUrl}`,
    songMediaUrl: `${env.serverUrl}/audio/${song.songMediaUrl}`,
  };
}
