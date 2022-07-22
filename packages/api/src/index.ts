import {
  initializeFan,
  initializeLibrary,
  initializeWordle,
  ioPort,
  port,
} from '@pi4/env';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { initFan } from './fan';
import { initLibrary } from './library';
import { initDbHealth } from './mongo/db';
import { initUi } from './ui';
import { initWordle } from './wordle/init-wordle';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initDbHealth(app);

if (initializeFan) {
  initFan(app, io);
}

if (initializeLibrary) {
  initLibrary(app);
}

if (initializeWordle) {
  initWordle(app, io);
}

initUi(app);

server.listen(ioPort);
console.log(`IO listening on ws://localhost:${ioPort}/`);

app.listen(port);
console.log(`API listening on http://localhost:${port}/`);
