const formatTime = (date) => {
  const hh = `0${date.getUTCHours()}`.slice(-2);
  const mm = `0${date.getUTCMinutes()}`.slice(-2);
  const ss = `0${date.getUTCSeconds()}`.slice(-2);
  return `${hh}:${mm}:${ss}`;
};

module.exports = (request, response) => {
  response.json(formatTime(new Date(process.uptime() * 1000)));
};
