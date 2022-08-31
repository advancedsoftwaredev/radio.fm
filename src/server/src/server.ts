import express, { Response, Request, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import ApiRouter from './api/api';
import { ApiError } from './api/errors';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socketTypes/socketTypes';

const app = express();
const port = 8080;

const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(__dirname + '/../../web/out'));
app.use(express.static(__dirname + '/audio/'));
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

io.on('connection', (socket) => {
  console.log('a user connected.');

  socket.on('disconnect', () => {
    console.log('a user disconnected.');
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
