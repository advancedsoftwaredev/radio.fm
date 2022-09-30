import express from 'express';

import AuthRouter from './auth/auth';
import { AdminSongRouter, PublicSongRouter } from './song/song';
import UserRouter from './user/user';

const ApiRouter = express.Router();

ApiRouter.use('/song', PublicSongRouter);
ApiRouter.use('/song-admin', AdminSongRouter);
ApiRouter.use('/auth', AuthRouter);
ApiRouter.use('/user', UserRouter);

export default ApiRouter;
