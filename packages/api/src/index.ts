import cors from 'cors';
import express, { Request, Response } from 'express';
import { readFileSync } from 'fs';
import {
  getLibraryCardCollection,
  LibraryCardOwner,
} from './mongo/library-cards';

import { Cache } from './cache';
import { Book, BookOwner, getBooks } from './get-books';
import { FanCPU } from '@pi4/cpu-fan';

const app = express();
app.use(cors());

const fan = new FanCPU({
  pin: 24,
});

fan.run();

const caches: Cache<Book[]>[] = [
  new Cache<Book[]>({
    name: 'josh',
    timeout: 1000 * 60 * 60,
    async getter() {
      const [card, pin] = readFileSync(`./.env/josh.txt`)
        .toString()
        .split('\n');
      return await getBooks(card, pin);
    },
  }),
  new Cache<Book[]>({
    name: 'christi',
    timeout: 1000 * 60 * 60,
    async getter() {
      const [card, pin] = readFileSync(`./.env/christi.txt`)
        .toString()
        .split('\n');
      return await getBooks(card, pin);
    },
  }),
];

app.get('/', async (req: Request, res: Response) => {
  // clear all
  // await Promise.all(caches.map(cache => cache.clear()));

  // await new Promise(resolve => setTimeout(resolve, 2000));

  // res.statusCode = 400;
  // res.send(null);

  // read all
  const data = await Promise.all(caches.map(cache => cache.read()));

  const items: (Book & { owner: BookOwner })[] = [];
  data.forEach((books, i) => {
    const owner = caches[i].name as BookOwner;
    books.forEach(book => {
      items.push({
        ...book,
        owner,
      });
    });
  });

  // const items: (Book & { owner: Owner })[] = [
  //   {
  //     title: 'Where The Wild Things Are' as BookTitle,
  //     status: BookStatus.out,
  //     due: '2022-05-08' as DueDate,
  //     owner: 'josh' as Owner,
  //   },
  //   {
  //     title: 'Sisterhood of the Traveling Pants' as BookTitle,
  //     status: BookStatus.out,
  //     due: '2022-05-08' as DueDate,
  //     owner: 'christi' as Owner,
  //   },
  //   {
  //     title: 'The Little Prince' as BookTitle,
  //     status: BookStatus.out,
  //     due: '2022-05-09' as DueDate,
  //     owner: 'josh' as Owner,
  //   },
  //   {
  //     title: 'The Hobbit' as BookTitle,
  //     status: BookStatus.out,
  //     due: '2022-05-08' as DueDate,
  //     owner: 'josh' as Owner,
  //   },
  // ];

  res.json(items.sort((a, b) => `${a.due}`.localeCompare(`${b.due}`)));
});

app.get('/db', async (_req: Request, res: Response) => {
  const libraryCardCollection = await getLibraryCardCollection();

  const owners: LibraryCardOwner[] = [];

  const rows = await libraryCardCollection.find({});
  for await (const row of rows) {
    owners.push(row.owner);
  }

  res.json(owners);
});

app.get('/temp', async (_req: Request, res: Response) => {
  res.json({
    temp: fan.temp ?? null,
  });
});

const port = 3000;
app.listen(port);
console.log(`Listening on port ${port}`);
