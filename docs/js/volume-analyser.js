class VolumeAnalyser {
  constructor(element, fftSize) {
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
    const dataArray = new Uint8Array(this.bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  draw({dataArray}) {
    const average = dataArray
      .reduce((prev, curr) => prev + curr, 0 ) / dataArray.length;

    this.bar.style.animationDelay = `-${average}ms`;
  }
};
