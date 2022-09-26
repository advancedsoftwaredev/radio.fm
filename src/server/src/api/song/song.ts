import type { Song } from '@prisma/client';
import express from 'express';

import type { ApiSongInfo, SongByIdInput } from '../../apiTypes/song';
import { authenticatedRouter } from '../../utils/authentication';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../errors';

const SongRouter = authenticatedRouter(express.Router());

SongRouter.post<SongByIdInput, ApiSongInfo>('/song-info', async (req) => {
  const song: Song | null = await getSongById(req.body.id);
  if (!song) {
    throw new NotFoundError('No song found with that Id');
  }
  return song;
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
    removed: song.removed,
  };
}

export default SongRouter;
