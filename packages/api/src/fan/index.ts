import { FanCPU } from '@pi4/cpu-fan';
import { fanPin, maxTemp, minTemp } from '@pi4/env';
import { SocketIoEvent } from '@pi4/interfaces';
import { Express, Request, Response } from 'express';
import { Server, Socket } from 'socket.io';

const prefix = 'fan';

export function initFan(app: Express, io: Server) {
  console.log(`Initializing CPU Fan`);

  const fan = new FanCPU({
    pin: fanPin,
    maxTemp,
    minTemp,
  });

  fan.run();

  io.on('connection', (client: Socket) => {
    console.log(`We have a (fan) connection!`);
    client.on(SocketIoEvent.requestCpuTemp, () => {
      client.emit(SocketIoEvent.cpuTempChange, fan.temp);

      let interval = setInterval(() => {
        client.emit(SocketIoEvent.cpuTempChange, fan.temp);
      }, 1000);

      client.on('disconnect', () => {
        clearTimeout(interval);
      });
    });

    client.on('request-fan-status', () => {
      const stopListeningForFanChanges = fan.onChange(active => {
        client.emit('fan:update', active);
      });

      client.on('disconnect', () => {
        stopListeningForFanChanges();
      });

      client.emit('fan:update', fan.isActive);
    });
  });

  app.get(`/${prefix}/temp`, async (_req: Request, res: Response) => {
    res.json({
      temp: fan.temp ?? null,
    });
  });
}
