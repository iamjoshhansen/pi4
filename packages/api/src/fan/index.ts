import { FanCPU } from '@pi4/cpu-fan';
import { fanPin, maxTemp, minTemp } from '@pi4/env';
import { Express, Request, Response } from 'express';

const prefix = 'fan';

export function initFan(app: Express) {
  console.log(`Initializing CPU Fan`);

  const fan = new FanCPU({
    pin: fanPin,
    maxTemp,
    minTemp,
  });

  fan.run();

  app.get(`/${prefix}/temp`, async (_req: Request, res: Response) => {
    res.json({
      temp: fan.temp ?? null,
    });
  });
}
