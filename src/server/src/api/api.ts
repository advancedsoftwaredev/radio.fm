import express from 'express';

import AuthRouter from './auth/auth';
import { QueueRouter } from './queue/queue';
import { AdminSongRouter, PublicSongRouter } from './song/song';
import SongLogRouter from './songLog/song-log';
import UserRouter from './user/user';

const ApiRouter = express.Router();

ApiRouter.use('/song', PublicSongRouter);
ApiRouter.use('/song-admin', AdminSongRouter);
ApiRouter.use('/auth', AuthRouter);
ApiRouter.use('/user', UserRouter);
ApiRouter.use('/queue', QueueRouter);
ApiRouter.use('/song-log', SongLogRouter);

export default ApiRouter;
