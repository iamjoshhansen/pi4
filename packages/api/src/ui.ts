import express, { Express, Request, Response } from 'express';
const path = require('path');
var bodyParser = require('body-parser');

export function initUi(app: Express) {
  app.use(bodyParser.json());

  const dist = path.resolve(__dirname + '/../../ui/dist/ui/');
  app.use('/app/', express.static(dist, { redirect: false }));

  app.get('*', function (req, res, next) {
    res.sendFile(path.resolve(path.join(dist, 'index.html')));
  });
}
