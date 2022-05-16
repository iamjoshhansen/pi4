import { MongoClient, Db } from 'mongodb';
import { mongoUri, dbName } from '../env';

export const database = new Promise<Db>(async resolve => {
  const client = new MongoClient(mongoUri, {
    tlsAllowInvalidCertificates: true,
  });

  await client.connect();

  resolve(client.db(dbName));
});

export async function dbCollection<T>(name: string) {
  const db = await database;
  return db.collection<T>(name);
}

export * from './library-cards';
