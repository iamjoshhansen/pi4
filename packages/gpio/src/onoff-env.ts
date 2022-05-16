// import { dev } from '@pi4/env';
const dev = true;
export const Gpio = dev
  ? require('./onoff-fake').GpioFake
  : require('onoff').Gpio;
