class VolumeAnalyser {
  constructor(element, fftSize) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = audioCtx.createAnalyser();

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

  draw({dataArray, canvas, chartColors}) {
    const { width, height } = canvas;
    const barWidth = width / this.bufferLength;
    const ctx = canvas.getContext('2d');

    let x = 0;

    ctx.fillStyle = chartColors.background;
    ctx.fillRect(0, 0, width, height);

    dataArray.forEach((value) => {
      const barHeight = value / 2 || 1;
      const y = height - barHeight;

      ctx.fillStyle = value ? chartColors.fill : chartColors.empty;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth + 1;



    })
  }
};
