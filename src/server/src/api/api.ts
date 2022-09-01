import express, { NextFunction, Request, Response } from 'express';
import { authMiddleware } from 'src/utils/authentication';
import SongRouter from './song/song';

const ApiRouter = express.Router();
ApiRouter.use(authMiddleware);

ApiRouter.use('/song', SongRouter);

export default ApiRouter;
