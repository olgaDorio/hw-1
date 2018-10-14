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

const slice = (array, query) => {
  const page = query.hasOwnProperty('page') ? Math.abs(query.page) : 0;
  const amount = Math.abs(query.amount) || array.length;

  const from = page * amount;
  const to = page * amount + amount;
  const isAvailable = to <= array.length;

  return {
    page: isAvailable ? page : Math.floor(array.length / amount),
    array: isAvailable ? array.slice(from, to) : array.slice(-amount),
    debug_amount: array.length,
    arrayLength: array.length,
  };
};

module.exports = (request, response, next) => {
  const types = request.query.type ? request.query.type.split(':') : '';

  if (types && types.some(type => !allowedTypes.includes(type))) {
    next({
      code: 400,
      message: JSON.stringify('incorrect type'),
    });
    return;
  }

  const filtered = filter(events, types);
  response.json(slice(filtered, request.query));
  response.end();
};
