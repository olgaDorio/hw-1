module.exports = {
  formatTime: (date) => {
    const hh = `0${date.getUTCHours()}`.slice(-2);
    const mm = `0${date.getUTCMinutes()}`.slice(-2);
    const ss = `0${date.getUTCSeconds()}`.slice(-2);
    return `${hh}:${mm}:${ss}`;
  },

  filter: (array, type) => {
    if (!type) {
      return array;
    }

    const condition = [].concat(type);

    return array.filter(item => (
      condition.includes(item.type)
    ));
  }
}
