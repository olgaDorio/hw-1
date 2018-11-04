import Slider from './slider';
import initVideo from './initVideo';
import VolumeAnalyser from './analyser';

class Player {
  constructor(links, fftSize = 256, emit) {
    this.sliders = this.createSliders();
    this.wrappers = [...document.querySelectorAll('.video__wrapper')];
    this.controls = document.querySelector('.video__controls');
    this.videos = [...document.querySelectorAll('.video')];
    this.goBack = this.controls.querySelector('.button');
    this.fftSize = fftSize;
    this.links = links;

    this.emit = emit;
    this.init();
  }

  updateStyles(filters, index) {
    const { contrast, brightness } = filters;
    this.videos[index].style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
  }

  updateSliders(filters) {
    this.sliders.forEach((slider) => { slider.setValue(filters[slider.name], true); });
  }

  updateVolume(e) {
    const video = e.target;
    const volumeAnalyser = new VolumeAnalyser(video, this.fftSize);
    const repaint = () => {
      requestAnimationFrame(repaint);

      if (video.parentNode.classList.contains('video--open')) {
        volumeAnalyser.draw();
      }
    };

    repaint();
  }

  toggleView(element, index = 0) {
    element.classList.toggle('video--open');
    this.controls.classList.toggle('video__controls--shown');
    element.querySelector('video').muted = !element.querySelector('video').muted;
  }

  play(e) {
    if (this.videos.every(v => !v.paused)) {
      return;
    }

    e.stopPropagation();
    this.videos.forEach(v => v.play());
  }

  init() {
    this.videos.forEach((video, index) => {
      initVideo(video, this.links[index]);
      video.addEventListener('click', this.play.bind(this));
      video.addEventListener('loadeddata', this.updateVolume.bind(this));
      video.parentNode.addEventListener('click', () => {
        this.emit('setFullscreen', index)
      })
    });

    this.goBack.addEventListener('click', () => {
      this.emit('setFullscreen', -1)
    });
  }

  createSliders() {
    return [...document.querySelectorAll('.slider')].map((slider) => {
      const onChange = (value) => {
        const property = slider.dataset.name;
        this.emit('setFilter', { value, property })
      };
      return new Slider({ slider, onChange })
    });
  }
}

export default Player;
