import React from "react";

const fftSize = 256;

class Analyser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      volume: 50,
    };
  }

  render() {
    return <div className="video__chart chart">
      <div className="chart__bar" style={{'animationDelay': `-${this.state.volume}ms`}}></div>
    </div>
  }
}

export default Analyser

// class VolumeAnalyser {
//   constructor(element, fftSize) {
//     const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     this.analyser = audioCtx.createAnalyser();
//     this.bar = document.querySelector('.chart__bar');

//     const source = audioCtx.createMediaElementSource(element);
//     source.connect(this.analyser);
//     this.analyser.connect(audioCtx.destination);

//     this.analyser.fftSize = fftSize;
//     this.bufferLength = this.analyser.frequencyBinCount;
//   }

//   getData() {
//     const dataArray = new Uint8Array(this.bufferLength);
//     this.analyser.getByteFrequencyData(dataArray);
//     return dataArray;
//   }

//   draw({ dataArray }) {
//     const average = dataArray
//       .reduce((prev, curr) => prev + curr, 0) / dataArray.length;

//     this.bar.style.animationDelay = `-${average}ms`;
//   }
// }
