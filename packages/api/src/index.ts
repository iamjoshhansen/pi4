import {
  initializeFan,
  initializeLibrary,
  initializeWordle,
  ioPort,
  port,
  weatherApiKey,
  weatherApiUri,
} from '@pi4/env';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

import { initFan } from './fan';
import { initLibrary } from './library';
import { initDbHealth } from './mongo/db';
import { speak } from './speak';
import { initUi } from './ui';
import { WeatherApp } from './weather/weather.app';
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
} else {
  console.info(`Skipping Fan`);
}

if (initializeLibrary) {
  initLibrary(app);
} else {
  console.info(`Skipping Library`);
}

if (initializeWordle) {
  initWordle(app, io);
} else {
  console.info(`Skipping Wordle`);
}

console.log(`Initializing Weather`);
new WeatherApp({
  io,
  key: weatherApiKey,
  api: weatherApiUri,
}).init();

initUi(app);

io.on('connection', (socket: Socket) => {
  socket.on('speak', async (message: string, cb?: (error?: string) => void) => {
    if (!message) {
      console.warn(`Spoken message was empty`);
      if (cb) {
        cb(`Spoken message was empty`);
      }
      return;
    }
    console.log(`Speaking:`, message);
    await speak(message);
    if (cb) {
      cb();
    }
  });
});

server.listen(ioPort);
console.log(`IO listening on ws://localhost:${ioPort}/`);

app.listen(port);
console.log(`API listening on http://localhost:${port}/`);
