const videos = [...document.querySelectorAll('.video')];
const wrappers = [...document.querySelectorAll('.video__wrapper')];
const sliders = [...document.querySelectorAll('.slider')].map(slider => new Slider({ slider }));

const controls = document.querySelector('.video__controls');
const goBack = controls.querySelector('.button');
const videoContainer = document.querySelector('.video__container');

const fftSize = 256;

const links = [
  'assets/streams/cat/master.m3u8',
  'assets/streams/dog/master.m3u8',
  'assets/streams/hall/master.m3u8',
  'assets/streams/sosed/master.m3u8',
];

const filters = Array.from({length: 4}, () => ({
  brightness: 100,
  contrast: 100,
}));

const getOpenVideo = (getIndex) => {
  return wrappers[getIndex ? 'findIndex' : 'find'](node => node.classList.contains('video--open'));
};

const updateStyle = (index) => {
  const { brightness, contrast } = filters[index];
  videos[index].style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
};

const updateInputValue = (index) => {
  sliders.forEach((slider) => {
    slider.setValue(filters[index][slider.name], true);
  })
};

const toggleView = (element, index = 0) => {
  element.classList.toggle('video--open');
  controls.classList.toggle('video__controls--shown');
  element.querySelector('video').muted = !element.querySelector('video').muted;
  updateInputValue(index);
};

const play = (e) => {
  if (videos.every(v => !v.paused)) {
    return;
  }

  e.stopPropagation();
  videos.forEach(v => v.play());
};

links.forEach((link, index) => {
  initVideo(videos[index], link);
});

videoContainer.addEventListener('click', (e) => {
  const target = e.target.closest('.video__wrapper');

  if (!target || target.classList.contains('video--open')) {
    return;
  }

  const index = [...target.parentNode.children].findIndex(child => child === target);
  toggleView(target, index);
});

goBack.addEventListener('click', () => {
  toggleView(getOpenVideo());
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
        dataArray: volumeAnalyser.getData(),
      });
    };

    repaint();
  })

  video.addEventListener('click', play);
});

sliders.forEach((slider) => {
  slider.onChange = (value) => {
    const index = getOpenVideo(true);
    filters[index][slider.name] = value;
    updateStyle(index);
  }
});
