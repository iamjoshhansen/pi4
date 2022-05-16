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

export const mongoUri = process.env.mongoUri!;
export const dbName = process.env.dbName!;
export const dev = asBoolean(process.env.dev)!;
export const fanPin = asNumber(process.env.fanPin)!;

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

check({ mongoUri, dbName, dev, fanPin });

if (missing.size > 0) {
  throw new Error(
    `The following are missing from your .env file:\n- ${[...missing].join(
      '\n- ',
    )}`,
  );
}
