import cors from 'cors';
import express from 'express';

import { initFan } from './fan';
import { initLibrary } from './library';

const app = express();
app.use(cors());

initFan(app);
initLibrary(app);

// app.get('/db', async (_req: Request, res: Response) => {
//   const libraryCardCollection = await getLibraryCardCollection();

//   const owners: LibraryCardOwner[] = [];

//   const rows = await libraryCardCollection.find({});
//   for await (const row of rows) {
//     owners.push(row.owner);
//   }

//   res.json(owners);
// });

const port = 3000;
app.listen(port);
console.log(`Listening on http://localhost:${port}/`);
