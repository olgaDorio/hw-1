import Slider from './slider';
import initVideo from './init-hls';
import VolumeAnalyser from './volume-analyser';

const videos = [...document.querySelectorAll<HTMLVideoElement>('.video')];
const wrappers = [...document.querySelectorAll<HTMLElement>('.video__wrapper')];
const sliders = [...document.querySelectorAll<HTMLElement>('.slider')].map(s => new Slider(s));

const controls = document.querySelector('.video__controls');
const goBack = controls && controls.querySelector('.button'); // ?
const videoContainer = document.querySelector('.video__container');

const fftSize = 256;

const links = [
  'assets/streams/cat/master.m3u8',
  'assets/streams/dog/master.m3u8',
  'assets/streams/hall/master.m3u8',
  'assets/streams/sosed/master.m3u8',
];

const filters:{ [index:string] : number }[] = Array.from({ length: 4 }, () => ({
  brightness: 100,
  contrast: 100,
}));

const getOpenVideo = (getIndex?: Boolean) => (
  wrappers[getIndex ? 'findIndex' : 'find'](node => node.classList.contains('video--open'))
 );

const updateStyle = (index: number) => {
  const { brightness, contrast } = filters[index];
  videos[index].style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
};

const updateInputValue = (index: number) => {
  sliders.forEach((slider) => {
    slider.setValue(filters[index][slider.name], true);
  });
};

const toggleView = (element: HTMLElement, index = 0) => {
  const video = element.querySelector('video');

  element.classList.toggle('video--open');
  controls && controls.classList.toggle('video__controls--shown');
  if (video) video.muted = !video.muted;
  updateInputValue(index);
};

const play = (e: Event) => {
  if (videos.every(v => !v.paused)) {
    return;
  }

  e.stopPropagation();
  videos.forEach(v => v.play());
};

links.forEach((link, index) => {
  initVideo(videos[index], link);
});

videoContainer && videoContainer.addEventListener('click', (e) => {
  const target = (<HTMLElement>e.target).closest('.video__wrapper') as HTMLElement;

  if (!target || target.classList.contains('video--open')) {
    return;
  }

  if (!target.parentNode) return;
  const index = [...target.parentNode.children].findIndex(child => child === target);
  toggleView(target, index);
});

goBack && goBack.addEventListener('click', () => {
  const openedVideo = getOpenVideo() as HTMLElement;
  if (openedVideo) toggleView(openedVideo);
});

videos.forEach((video) => {
  video.addEventListener('loadeddata', () => {
    const volumeAnalyser = new VolumeAnalyser(video, fftSize);

    const repaint = () => {
      requestAnimationFrame(repaint);

      if (!video.parentNode || !(<HTMLElement>video.parentNode).classList.contains('video--open')) {
        return;
      }

      volumeAnalyser.draw({
        dataArray: volumeAnalyser.getData(),
      });
    };

    repaint();
  });

  video.addEventListener('click', play);
});

sliders.forEach((slider) => {
  slider.onChange = (value: number) => {
    const index = getOpenVideo(true) as number;
    filters[index][slider.name] = value;
    updateStyle(index);
  };
});
