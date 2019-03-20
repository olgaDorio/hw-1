import { Request, Response, NextFunction } from 'express';

const { events } = require('./../events.json');
const { allowedTypes } = require('./../defines.js');

const filter = (array: { type: string }[], types?: string[]) => {
  if (!types) {
    return array;
  }

  return array.filter(item => (
    types.includes(item.type)
  ));
};

const slice = (array: {}[], params: {page: number, amount: number}) => {
  const page = params.page ? Math.abs(params.page) : 0;
  const amount = Math.abs(params.amount) || array.length;

  const from = page * amount;
  const to = page * amount + amount;
  const isAvailable = to <= array.length;

  return {
    page: isAvailable ? page : Math.floor((array.length - 1) / amount),
    array: isAvailable ? array.slice(from, to) : array.slice(-amount),
    arrayLength: array.length,
  };
};

module.exports = (request: Request, response: Response, next: NextFunction) => {
  const params = { ...request.query, ...request.body };
  const types: string[]|undefined = params.type ? params.type.split(':') : undefined;

  if (types && types.some(type => !!type && !allowedTypes.includes(type))) {
    next({
      code: 400,
      message: JSON.stringify('incorrect type'),
    });
    return;
  }

  const filtered = filter(events, types);
  response.json(slice(filtered, params));
  response.end();
};
