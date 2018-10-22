const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const getEvents = require('./getEvents.js');
const getUptime = require('./getUptime.js');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.get('/status', getUptime);
app.post('/status', getUptime);

app.get('/api/events', getEvents);
app.post('/api/events', getEvents);

app.get('*', (request, response, next) => {
  next({
    code: 404,
    message: '<h1>Page not found</h1>',
  });
});

app.use((error, req, res, next) => {
  const code = error.code || 500;
  const message = error.message || 'Something broke';
  res.status(code);
  res.send(message);
  next()
});

app.listen(port, (error) => {
  console.log(error || `server is listening on ${port}`);
});
