import { dbName, mongoUri } from '@pi4/env';
import { Express, Request, Response } from 'express';
import { Db, MongoClient } from 'mongodb';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

export enum DbConnectionState {
  idle = 'idle',
  connecting = 'connecting',
  connected = 'connected',
  error = 'error',
}
const dbConnectionStateSubject = new BehaviorSubject<DbConnectionState>(
  DbConnectionState.idle,
);
export const dbConnectionState$ = dbConnectionStateSubject.pipe(
  distinctUntilChanged(),
);

export const database = new Promise<Db>(async resolve => {
  const client = new MongoClient(mongoUri, {
    tlsAllowInvalidCertificates: true,
  });

  try {
    dbConnectionStateSubject.next(DbConnectionState.connecting);
    await client.connect();
    dbConnectionStateSubject.next(DbConnectionState.connected);
    resolve(client.db(dbName));
  } catch (er) {
    dbConnectionStateSubject.next(DbConnectionState.error);
    console.warn(`DB is out of reach`);
  }
});

export async function dbCollection<T>(name: string) {
  const db = await database;
  return db.collection<T>(name);
}

export function initDbHealth(app: Express) {
  app.get(`/db-health`, async (req: Request, res: Response) => {
    res.json({
      status: dbConnectionStateSubject.value,
    });
  });
}

export * from './library-cards';
