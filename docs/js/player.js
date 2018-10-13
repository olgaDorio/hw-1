// TODO
// unmute fullscreened video

const videos = [...document.querySelectorAll('.video')];
const wrappers = [...document.querySelectorAll('.video__wrapper')];
const page = document.querySelector('.page__player');
const controls = document.querySelector('.video__controls');
const ranges = document.querySelectorAll('input');
const videoContainer = document.querySelector('.video__container');
const hideButton = document.getElementById('back');

const chartColors = {
  background: '#FAFAFA',
  fill: '#C5C5C5',
};
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

const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');

videos.forEach((video, index) => {


  video.addEventListener('loadeddata', () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();

    const source = audioCtx.createMediaElementSource(video);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

      if (!video.parentNode.classList.contains('video--open')) {
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      const { width, height } = canvas;
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      ctx.fillStyle = chartColors.background;
      ctx.fillRect(0, 0, width, height);

      dataArray.forEach((value) => {
        // if !barHeight use different color
        const barHeight = value / 2 + 10;
        const y = height - barHeight;

        ctx.fillStyle = chartColors.fill;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      })
    };

    draw();
  })
})


