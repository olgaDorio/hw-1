const fs = require('fs');
const path = require('path');
const express = require('express');
const { promisify } = require('util');
const { formatTime, filter } = require('./utils.js');

const app = express();
const port = process.env.PORT || 8000;

fs.readFilePromisified = promisify(fs.readFile);

app.get('/status', (request, response) => {
  response.send(formatTime(new Date(process.uptime() * 1000)));
});

app.get('/api/events', (request, response, next) => {
  fs.readFilePromisified(path.join(process.cwd(), 'events.json'), 'utf8')
    .then((data) => {
      const { events } = JSON.parse(data);
      const filtered = filter(events, request.query.type);
      if (!filtered.length) {
        next({
          status: 400,
          message: 'incorrect type',
        });
        return;
      }
      response.json(filtered);
      response.end();
    })
    .catch(next);
});

app.get('*', (request, response) => {
  response.status(404);
  response.send('<h1>Page not found</h1>');
});

app.use(function(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || 'Something broke';
  res.status(status);
  res.json({ message });
});

app.listen(port, (error) => {
  console.log(error || `server is listening on ${port}`);
});
