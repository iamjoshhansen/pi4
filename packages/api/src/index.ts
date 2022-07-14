import { ioPort, port } from '@pi4/env';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

import { initFan } from './fan';
import { initLibrary } from './library';
import { initUi } from './ui';
import { initWordle } from './wordle/init-wordle';
import { initDbHealth } from './mongo/db';

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
initFan(app, io);
// initLibrary(app);
initWordle(app, io);

initUi(app);

server.listen(ioPort);
console.log(`IO listening on ws://localhost:${ioPort}/`);

app.listen(port);
console.log(`API listening on http://localhost:${port}/`);
