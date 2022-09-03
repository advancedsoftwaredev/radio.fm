import express, { Response, Request, NextFunction } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import ApiRouter from './api/api';
import { ApiError, AuthorizationError } from './api/errors';
import { MessageData, SongData, CurrentSongData } from './socketTypes/socketDataTypes';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socketTypes/socketTypes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { ApiUser } from '../../web/apiTypes/user';
import cookie from 'cookie';
import { decodeToken, getSessionWithUserBySessionId } from './utils/authentication';
import { mapUserToApiUser } from './api/user/user';
import { ExtendedError } from 'socket.io/dist/namespace';
import { getCurrentSong, getInQueue, getNextSong, getQueueLength } from './utils/queue';

const app = express();
const port = 8080;

const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.static(__dirname + '/../../web/out'));
app.use(express.static(__dirname + '/audio/'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', ApiRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
  } else {
    res.status(500).send('Internal server error');
  }
});

const getListenerCount = (namespace: string = '/') => io.of(namespace).sockets.size;

interface SocketWithUser extends Socket {
  data: {
    user?: ApiUser;
  };
}

const socketMiddleware = async (socket: SocketWithUser, next: (err?: ExtendedError | undefined) => void) => {
  const socketCookies = cookie.parse(socket.request.headers.cookie ?? '');
  const token: string | undefined = socketCookies?.token;
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

const songQueueHandler = async (): Promise<any> => {
  const queueLength = await getQueueLength();
  const minimumInQueue = 3;

  if (queueLength < minimumInQueue) {
    for (let i = queueLength; i < minimumInQueue; i++) {
      // Add random song which isn't in the queue
    }
  }

  const currentSong = await getInQueue();
  const nextSong = await getNextSong();

  if (!currentSong || !nextSong) {
    return songQueueHandler();
  }

  setTimeout(() => {
    io.emit('newSong', {
      song: nextSong?.song,
      time: 0,
    });
    songQueueHandler();
  }, 1000 + currentSong.song.length * 1000 - (new Date().getTime() - currentSong?.timeStarted.getTime()));
};

songQueueHandler();

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
