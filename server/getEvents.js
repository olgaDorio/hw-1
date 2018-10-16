const { events } = require('./../events.json');
const { allowedTypes } = require('./../defines.js');

const filter = (array, types) => {
  if (!types) {
    return array;
  }

  return array.filter(item => (
    types.includes(item.type)
  ));
};

const slice = (array, params) => {
  const page = params.hasOwnProperty('page') ? Math.abs(params.page) : 0;
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

module.exports = (request, response, next) => {
  const params = { ...request.query, ...request.body };
  const types = params.type ? params.type.split(':') : '';

  if (types && types.some(type => !allowedTypes.includes(type))) {
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
