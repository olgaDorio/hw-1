import router from './router';
import Player from './player/index';
import createStore from './commonStore';

const store = createStore();
router(store);

const links = ['cat', 'dog', 'hall', 'sosed'].map(r => `assets/streams/${r}/master.m3u8`);
const player = new Player(links, 256, store.dispatch);

const onFullscreenChange = (state, oldState) => {
  const current = state.player.fullscreen;
  const previous = oldState ? oldState.player.fullscreen : undefined;

  if (current >= 0) {
    player.toggleView(player.wrappers[current], current);
    player.updateSliders(state.player.filters[current]);
  } else if (previous >= 0) {
    player.toggleView(player.wrappers[previous], previous);
    player.updateSliders(state.player.filters[previous]);
  }
};

const onFiltersChange = (state) => {
  state.player.filters.forEach(player.updateStyles.bind(player));
};

store.subscribe('player.fullscreen', onFullscreenChange, true);
store.subscribe('player.filters', onFiltersChange, true);
