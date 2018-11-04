import createStore from 'reimagined-memory';

export default () => {
  const contrast = 100;
  const brightness = 100;

  const defaultCallback = (state) => {
    localStorage.setItem('state', JSON.stringify(state));
  };

  const { pathname } = window.location;

  const store = createStore({
    state: {
      events: [],

      scrollTop: 0,

      player: {
        fullscreen: -1,
        filters: Array.from({ length: 4 }, () => ({ brightness, contrast })),
      },

      route: pathname.length > 1 ? pathname : '/index.html',

      ...JSON.parse(localStorage.state || '{}'),
    },

    actions: {
      getEvents(state) {
        fetch('https://agile-plains-47360.herokuapp.com/api/events')
          .then(r => r.json())
          .then(({ array }) => {
            state.events = array;
          })
          .catch(console.log);
      },

      setScroll(state, value) {
        state.scrollTop = value;
      },

      setRoute(state, route) {
        state.route = route;
      },

      setFullscreen(state, index) {
        state.player.fullscreen = index;
      },

      setFilter(state, { property, value }) {
        const index = state.player.fullscreen;
        state.player.filters[index][property] = value;
      },
    },
  }, defaultCallback);

  store.subscribe('.route', (state) => {
    if (window.location.pathname !== state.route) {
      window.location.assign(`${state.route}`);
    }
  }, true);

  return store;
};
