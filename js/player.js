// TODO
// unmute fullscreened video

const videos = [...document.querySelectorAll('.video')];
const wrappers = [...document.querySelectorAll('.video__wrapper')];
const page = document.querySelector('.page__player');
const controls = document.querySelector('.video__controls');
const ranges = document.querySelectorAll('input');
const videoContainer = document.querySelector('.video__container');
const hideButton = document.getElementById('back');

const filters = Array.from({length: 4}, () => ({
  brightness: 100,
  contrast: 100,
}));

const setFilterStyle = (index) => {
  const { brightness, contrast } = filters[index];
  // TODO think about setting it to video
  wrappers[index].style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
};

const setInputValue = (index) => {
  ranges.forEach((input) => {
    input.value = filters[index][input.name]
  })
};

const links = [
  'http://localhost:9191/master?url=http://localhost:3102/streams/cat/master.m3u8',
  'http://localhost:9191/master?url=http://localhost:3102/streams/dog/master.m3u8',
  'http://localhost:9191/master?url=http://localhost:3102/streams/hall/master.m3u8',
  'http://localhost:9191/master?url=http://localhost:3102/streams/sosed/master.m3u8',
];

links.forEach((link, index) => {
  initVideo(videos[index], link);
});

const show = (element, index) => {
  element.classList.add('video--open');
  page.nextElementSibling.style.display = 'none';
  page.previousElementSibling.style.display = 'none';
  controls.classList.add('video__controls--shown');
  page.classList.add('page__player--fullscreen');
  setInputValue(index);
  element.querySelector('video').muted = false;


  // also unmute here
};

const hide = (element) => {
  element.classList.remove('video--open');
  page.nextElementSibling.style = '';
  page.previousElementSibling.style = '';
  controls.classList.remove('video__controls--shown');
  page.classList.remove('page__player--fullscreen');
  element.querySelector('video').muted = true;
}

videoContainer.addEventListener('click', (e) => {
  const target = e.target.closest('.video__wrapper')

  if (!target || target.classList.contains('video--open')) {
    return;
  }

  const index = [...target.parentNode.children].findIndex(child => child === target);
  show(target, index);
});


hideButton.addEventListener('click', () => {
  hide(wrappers.find(wrapper => wrapper.classList.contains('video--open')));
})



ranges.forEach((range) => {
  range.addEventListener('input', (e) => {
    const index = wrappers.findIndex(wrapper => wrapper.classList.contains('video--open'));
    filters[index][e.target.name] = e.target.value;
    setFilterStyle(index);
  })
});
