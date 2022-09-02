import express, { Response, Request, NextFunction } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import ApiRouter from './api/api';
import { ApiError } from './api/errors';
import { MessageData } from './socketTypes/socketDataTypes';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socketTypes/socketTypes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { ApiUser } from '../../web/apiTypes/user';
import cookie from 'cookie';
import { decodeToken, getSessionWithUserBySessionId } from './utils/authentication';
import { mapUserToApiUser } from './api/user/user';

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
  if (res.headersSent) {
    return next(err);
  }
  if (req.xhr) {
    if (err instanceof ApiError) {
      res.status(err.code).json(err.message);
    } else {
      res.status(500).send('Internal server error');
    }
  } else {
    return next(err);
  }
});

const getListenerCount = (namespace: string = '/') => io.of(namespace).sockets.size;

interface SocketWithUser extends Socket {
  data: {
    user?: ApiUser;
  };
}

io.use(async (socket: SocketWithUser, next) => {
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
});

io.on('connection', (socket: SocketWithUser) => {
  console.log('a user connected.');

  io.emit('liveListener', { liveListenerCount: getListenerCount() });

  socket.on('message', (data: MessageData) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected.');

    io.emit('liveListener', { liveListenerCount: getListenerCount() });
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
