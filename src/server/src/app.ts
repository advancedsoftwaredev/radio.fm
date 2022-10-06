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
import { getCurrentSong, getNextSong } from './utils/queue';
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
export const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: corsOptions,
});

app.use(cookieParser());
app.use('/api', ApiRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
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

export const httpServer = server;
