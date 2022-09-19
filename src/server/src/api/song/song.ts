import type { Song } from '@prisma/client';
import type { NextFunction } from 'express';
import express from 'express';

import type { ApiSongInfo, SongByIdInput } from '../../apiTypes/song';
import { authMiddleware } from '../../utils/authentication';
import prisma from '../../utils/prisma';
import type { TypedRequestBody, TypedResponse } from '../apiTypes';
import { NotFoundError } from '../errors';

const SongRouter = express.Router();

SongRouter.use(authMiddleware);

SongRouter.post(
  '/song-info',
  async (req: TypedRequestBody<SongByIdInput>, res: TypedResponse<ApiSongInfo>, next: NextFunction) => {
    const song: Song | null = await getSongById(req.body.id);
    if (!song) {
      return next(new NotFoundError('No song found with that Id'));
    }
    res.status(200).json(song);
  }
);

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
