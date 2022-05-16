import { dev } from '@pi4/env';
export const Gpio = dev
  ? require('./onoff-fake').GpioFake
  : require('onoff').Gpio;
