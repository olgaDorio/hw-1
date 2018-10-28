import { Request, Response, NextFunction } from 'express';

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const getEvents = require('./getEvents');
const getUptime = require('./getUptime');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.get('/status', getUptime);
app.post('/status', getUptime);

app.get('/api/events', getEvents);
app.post('/api/events', getEvents);

app.get('*', (request: Request, response: Response, next: NextFunction) => {
  next({
    code: 404,
    message: '<h1>Page not found</h1>',
  });
});

interface Error {
  code?: number;
  message?: string;
}

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const code = error.code || 500;
  const message = error.message || 'Something broke';
  res.status(code);
  res.send(message);
  next();
});

app.listen(port, (error: {}) => {
  console.log(error || `server is listening on ${port}`);
});
