import cors from 'cors';
import express from 'express';
import { port } from '@pi4/env';

import { initFan } from './fan';
import { initUi } from './ui';
import { initLibrary } from './library';

const app = express();
app.use(cors());

initFan(app);
initLibrary(app);

initUi(app);

app.listen(port);
console.log(`Listening on http://localhost:${port}/`);
