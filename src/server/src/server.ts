import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socketTypes/socketTypes';

const app = express();
export const port = 8080;

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

io.on('connection', (socket) => {
  console.log('a user connected.');

  socket.on('disconnect', () => {
    console.log('a user disconnected.');
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
