import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import http from 'http';
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';
import type { ExtendedError } from 'socket.io/dist/namespace';

import ApiRouter from './api/api';
import { ApiError, AuthorizationError } from './api/errors';
import { mapUserToApiUser } from './api/user/user';
import type { ApiUser } from './apiTypes/user';
import { env } from './env';
import type { MessageData, SongData } from './socketTypes/socketDataTypes';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './socketTypes/socketTypes';
import { decodeToken, getSessionWithUserBySessionId } from './utils/authentication';
import { prisma } from './utils/prisma';
import {
  addToQueue,
  getCurrentSong,
  getInQueue,
  getNextSong,
  getQueueLength,
  removeFromQueue,
  resetFirstSong,
  startQueue,
} from './utils/queue';
import { getSongCount } from './utils/song';
import { addSongLog } from './utils/songLog';
import { audioStorage, imageStorage } from './utils/storage_interface';

const app = express();

// CORS Config to change
const corsOptions = {
  origin: env.corsUrl,
  include: '*',
  credentials: true,
  methods: ['GET', 'POST'],
};

// Allow CORS and Cookies
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/../../web/out'));

const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: corsOptions,
});

app.use(cookieParser());
app.use('/api', ApiRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
  } else {
    res.status(500).send('Internal server error');
  }
});

app.use('/audio', audioStorage.getRequestHandler());
app.use('/images', imageStorage.getRequestHandler());

const getListenerCount = (namespace = '/') => io.of(namespace).sockets.size;

interface SocketWithUser extends Socket {
  data: {
    user?: ApiUser;
  };
}

const socketMiddleware = async (socket: SocketWithUser, next: (err?: ExtendedError | undefined) => void) => {
  const socketCookies = cookie.parse(socket.request.headers.cookie ?? '');
  const token: string | undefined = socketCookies.token;
  if (!token) {
    return next();
  }
  const user = (await getSessionWithUserBySessionId(await decodeToken(token)))?.user;
  if (!user) {
    return next();
  }
  socket.data.user = mapUserToApiUser(user);
  next();
};

io.use(socketMiddleware);

io.on('connection', async (socket: SocketWithUser) => {
  console.log('a user connected.');

  io.emit('liveListener', { liveListenerCount: getListenerCount() });

  socket.emit('newSong', await getCurrentSong());

  socket.on('requestNextSong', async () => {
    socket.emit('nextSong', (await getNextSong())?.song);
  });

  socket.on('getTime', async () => {
    socket.emit('getTime', { time: (await getCurrentSong())?.time });
  });

  socket.on('message', (data: MessageData) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected.');

    io.emit('liveListener', { liveListenerCount: getListenerCount() });
  });
});

const ioAdmin = io.of('/admin');

ioAdmin.use(socketMiddleware);
ioAdmin.use((socket: SocketWithUser, next) => {
  if (socket.data.user?.role !== 'ADMIN') {
    return next(new AuthorizationError('Unauthorized to admin socket namespace'));
  }
  next();
});

ioAdmin.on('connection', (socket: SocketWithUser) => {
  //TODO
  socket.on('newSong', (data: SongData) => {});
});

export const songQueueHandler = async (): Promise<any> => {
  const queueLength = await getQueueLength();
  const songCount = await getSongCount();
  const minimumInQueue = 3;

  if (queueLength !== 0) {
    // Update the first song in the queue to make sure it hasn't "started yet", set timeStarted to null or something
    await resetFirstSong();
  }

  if (queueLength < minimumInQueue) {
    for (let i = queueLength; i < minimumInQueue; i++) {
      const skip = Math.floor(Math.random() * songCount);
      const songId = (await prisma.song.findFirst({ skip, take: 1 }))?.id;
      if (!songId) {
        return songQueueHandler();
      }
      await addToQueue(songId);
    }
  }

  console.log('============ Songs in queue ============');
  (await prisma.queue.findMany({ include: { song: true }, orderBy: [{ timeAdded: 'asc' }] })).forEach((song, i) =>
    console.log(`(${i + 1}) ${song.song.title}`)
  );

  await startQueue();

  const currentSong = await getInQueue();
  const nextSong = await getNextSong();

  if (!currentSong || !nextSong || !currentSong.timeStarted) {
    return songQueueHandler();
  }

  setTimeout(async () => {
    await addSongLog(
      currentSong.timeStarted || new Date(new Date().getTime() - currentSong.song.length * 1000),
      currentSong.songId
    );

    await removeFromQueue(currentSong.id);

    io.emit('newSong', {
      song: nextSong.song,
      time: 0,
      finished: true,
    });

    void songQueueHandler();
  }, 1000 + currentSong.song.length * 1000 - (new Date().getTime() - currentSong.timeStarted.getTime()));
};

export const httpServer = server;
