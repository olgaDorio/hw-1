const videos = [...document.querySelectorAll('.video')];
const wrappers = [...document.querySelectorAll('.video__wrapper')];
const controls = document.querySelector('.video__controls');

const inputs = controls.querySelectorAll('input');
const showAllButton = controls.querySelector('.button');
const canvas = controls.querySelector('.video__chart');
const videoContainer = document.querySelector('.video__container');

const fftSize = 256;

const chartColors = {
  fill: '#FFD93E',
  empty: '#C5C5C5',
  background: '#FFFFFF',
};

const filters = Array.from({length: 4}, () => ({
  brightness: 100,
  contrast: 100,
}));

const getOpenVideo = (findByIndex) => {
  return wrappers[findByIndex ? 'findIndex' : 'find'](node => node.classList.contains('video--open'));
};

const updateStyle = (index) => {
  const { brightness, contrast } = filters[index];
  videos[index].style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
};

const updateInputValue = (index) => {
  inputs.forEach((input) => {
    input.value = filters[index][input.name]
  });
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
  controls.classList.add('video__controls--shown');
  element.querySelector('video').muted = false;
  updateInputValue(index);
};

const hide = (element) => {
  element.classList.remove('video--open');
  controls.classList.remove('video__controls--shown');
  element.querySelector('video').muted = true;
};

videoContainer.addEventListener('click', (e) => {
  const target = e.target.closest('.video__wrapper')

  if (!target || target.classList.contains('video--open')) {
    return;
  }

  const index = [...target.parentNode.children].findIndex(child => child === target);
  show(target, index);
});

showAllButton.addEventListener('click', () => {
  hide(getOpenVideo());
});

inputs.forEach((range) => {
  range.addEventListener('input', (e) => {
    const index = getOpenVideo(true);
    filters[index][e.target.name] = e.target.value;
    updateStyle(index);
  })
});

videos.forEach((video, index) => {
  video.addEventListener('loadeddata', () => {
    const volumeAnalyser = new VolumeAnalyser(video, fftSize);

    const repaint = () => {
      requestAnimationFrame(repaint);

      if (!video.parentNode.classList.contains('video--open')) {
        return;
      }

      volumeAnalyser.draw({
        canvas,
        chartColors,
        dataArray: volumeAnalyser.getData(),
      });
    };

    repaint();
  })
})
