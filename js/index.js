import router from './router.js';
import Cards from './cards/index.js';
import createStore from './commonStore.js';
import compare from './compare.js';

const main = document.querySelector('.page__main');
const cards = new Cards(main);

const store = createStore();

store.dispatch('getEvents')
router(store);

main.addEventListener('scroll', (e) => {
  store.dispatch('setScroll', e.target.scrollTop);
});

const mountEvent = (state) => {
  cards.mount(state.events)
  cards.scroll(state.scrollTop);
};

store.subscribe('events', mountEvent, true);
