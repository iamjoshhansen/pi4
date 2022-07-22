import { resolve } from 'path';

const path = resolve(__dirname + '../../../../.env');
// console.log({ path });
require('dotenv').config({ path });

function asBoolean(val: any) {
  return typeof val === 'undefined' ? undefined : val === 'true';
}

function asNumber(val: any) {
  return typeof val === 'undefined' ? undefined : parseInt(val, 10);
}

export const port = asNumber(process.env.port)!;
export const ioPort = asNumber(process.env.ioPort)!;
export const mongoUri = process.env.mongoUri!;
export const dbName = process.env.dbName!;
export const dev = asBoolean(process.env.dev)!;
export const fanPin = asNumber(process.env.fanPin)!;
export const minTemp = asNumber(process.env.minTemp)!;
export const maxTemp = asNumber(process.env.maxTemp)!;
export const initializeFan = asBoolean(process.env.initializeFan)!;
export const initializeLibrary = asBoolean(process.env.initializeLibrary)!;
export const initializeWordle = asBoolean(process.env.initializeWordle)!;

const missing = new Set<string>();

function check(prop: Record<string, any>) {
  // console.log(prop);
  const keys = Object.keys(prop);
  for (const key of keys) {
    const val = prop[key];
    if (typeof val === 'undefined') {
      missing.add(key);
    }
  }
}

check({
  port,
  ioPort,
  mongoUri,
  dbName,
  dev,
  fanPin,
  minTemp,
  maxTemp,
  initializeFan,
  initializeLibrary,
  initializeWordle,
});

if (missing.size > 0) {
  throw new Error(
    `The following are missing from your .env file:\n- ${[...missing].join(
      '\n- ',
    )}`,
  );
}
