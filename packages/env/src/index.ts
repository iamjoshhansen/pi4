import { resolve } from 'path';

const path = resolve(__dirname + '../../../../.env');
// console.log({ path });
require('dotenv').config({ path });

function asBoolean(val: any) {
  return typeof val === 'undefined' ? undefined : val === 'true';
}

function asInt(val: any) {
  return typeof val === 'undefined' ? undefined : parseInt(val, 10);
}

function asFloat(val: any) {
  return typeof val === 'undefined' ? undefined : parseFloat(val);
}

export const port = asInt(process.env.port)!;
export const ioPort = asInt(process.env.ioPort)!;
export const mongoUri = process.env.mongoUri!;
export const dbName = process.env.dbName!;
export const dev = asBoolean(process.env.dev)!;
export const fanPin = asInt(process.env.fanPin)!;
export const minTemp = asInt(process.env.minTemp)!;
export const maxTemp = asInt(process.env.maxTemp)!;
export const initializeFan = asBoolean(process.env.initializeFan)!;
export const initializeLibrary = asBoolean(process.env.initializeLibrary)!;
export const initializeWordle = asBoolean(process.env.initializeWordle)!;
export const weatherApiUri = process.env.weatherApiUri!;
export const weatherApiKey = process.env.weatherApiKey!;
export const longitude = asFloat(process.env.longitude)!;
export const latitude = asFloat(process.env.latitude)!;

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
  weatherApiUri,
  weatherApiKey,
  longitude,
  latitude,
});

if (missing.size > 0) {
  throw new Error(
    `The following are missing from your .env file:\n- ${[...missing].join(
      '\n- ',
    )}`,
  );
}
