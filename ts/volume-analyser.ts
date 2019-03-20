interface Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}

declare var window: Window;

interface Draw {
  dataArray: Uint8Array;
}

class VolumeAnalyser {
  bar: any;
  analyser: any;
  bufferLength: any;

  constructor(element: HTMLVideoElement, fftSize: Number) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = audioCtx.createAnalyser();
    this.bar = document.querySelector('.chart__bar');

    const source = audioCtx.createMediaElementSource(element);
    source.connect(this.analyser);
    this.analyser.connect(audioCtx.destination);

    this.analyser.fftSize = fftSize;
    this.bufferLength = this.analyser.frequencyBinCount;
  }

  getData() {
    const dataArray: Uint8Array = new Uint8Array(this.bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  draw({ dataArray }: Draw) {
    const average = dataArray
      .reduce((prev: number, curr: number) => prev + curr, 0) / dataArray.length;

    this.bar.style.animationDelay = `-${average}ms`;
  }
}

export default VolumeAnalyser;
