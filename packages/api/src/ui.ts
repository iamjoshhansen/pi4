import express, { Express, Request, Response } from 'express';
const path = require('path');
var bodyParser = require('body-parser');

export function initUi(app: Express) {
  app.use(bodyParser.json());

  const dist = path.resolve(__dirname + '/../../ui/dist/ui/');
  // console.log({ dist });
  app.use(express.static(dist));

  app.get(['/app', '/app/*'], (req: Request, res: Response) => {
    const file = req.path.substring(4) || 'index.html';

    const finalPath = path.join(dist, file);
    console.log({ dist, file, finalPath });
    res.sendFile(finalPath);
  });
}
