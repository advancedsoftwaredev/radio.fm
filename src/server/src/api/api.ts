import express, { NextFunction, Request, Response } from 'express';
import SongRouter from './song/song';

const ApiRouter = express.Router();

ApiRouter.use('/song', SongRouter);

export default ApiRouter;
