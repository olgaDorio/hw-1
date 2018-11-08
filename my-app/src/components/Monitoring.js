import React from "react";
import Hls from 'hls.js'
import './../css/video.css'

class Monitoring extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      links: [
        'http://www.streambox.fr/playlists/test_001/stream.m3u8',
        'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
        'https://mnmedias.api.telequebec.tv/m3u8/29880.m3u8',
        'http://184.72.239.149/vod/smil:BigBuckBunny.smil/playlist.m3u8'
      ],
      fullscreen: -1,
      filters: Array.from({ length: 4 }, () => ({
        brightness: 100,
        contrast: 100,
      })),
    };
  }

  initVideo(video, url) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return;
    }

    if (!Hls.isSupported()) {
      return
    }

      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        video.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('fatal network error encountered, try to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover');
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
  }

  play() {
    this.videos.filter(Boolean).forEach((video) => {
      video.play();
    })
  }

  handleClick(index) {
    this.setState({
      fullscreen: index,
    })
  }

  componentDidMount() {
    this.videos.filter(Boolean).forEach((video, index) => {
      this.initVideo(video, this.state.links[index]);
    })
  }

  render() {
    const elements = this.state.links.map((src, index) => {
      return <div
        className={`video__wrapper ${index === this.state.fullscreen ? 'video--open' : ''}`}
        key={src}
        onClick={this.handleClick.bind(this, index)}
        >
        <video
          className="video"
          autoPlay="autoplay"
          muted="muted"
          loop="loop"
          ref={(video) => {
            this.videos = this.videos || [];
            this.videos.push(video);
          }}
          onClick={this.play.bind(this)}
          onLoadedMetadata={this.play.bind(this)}
          src=""></video>
      </div>
    })

    // TODO: slider component
    return <main className="page__main page__player">
      <div className={`video__controls ${this.state.fullscreen >= 0 ? 'video__controls--shown' : ''}`}>
        <button className="button button--default" onClick={this.handleClick.bind(this, -1)}>Все камеры</button>

        <label>
          Яркость
          <input type="range" value={this.state.fullscreen >= 0 ? this.state.filters[this.state.fullscreen].contrast : 0}/>
        </label>

        <label>
          Контрастность
          <input type="range" value={this.state.fullscreen >= 0 ? this.state.filters[this.state.fullscreen].brightness : 0}/>
        </label>

        <div className="video__chart chart">
          <div className="chart__bar"></div>
        </div>
      </div>
      <div className="video__container">
        {elements}
      </div>
    </main>
  }
}

export default Monitoring;
