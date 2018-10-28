import { Request, Response } from 'express';

const formatTime = (date: Date) => {
  const hours = Math.floor(date.getTime() / (1000 * 60 * 60));
  const hh = `0${hours}`.length < 3 ? `0${hours}`.slice(-2) : hours;
  const mm = `0${date.getUTCMinutes()}`.slice(-2);
  const ss = `0${date.getUTCSeconds()}`.slice(-2);
  return `${hh}:${mm}:${ss}`;
};

module.exports = (request: Request, response: Response) => {
  response.json(formatTime(new Date(process.uptime() * 1000)));
};
