import express from 'express';
import AuthRouter from './auth/auth';
import SongRouter from './song/song';
import UserRouter from './user/user';

const ApiRouter = express.Router();

ApiRouter.use('/song', SongRouter);
ApiRouter.use('/auth', AuthRouter);
ApiRouter.use('/user', UserRouter);

export default ApiRouter;
