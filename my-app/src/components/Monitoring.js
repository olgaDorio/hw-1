import React from "react";
import Hls from 'hls.js'
import './../css/video.css'
import Analyser from './Analyser';

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
        brightness: 1,
        contrast: 1,
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

  handleInputChange(event) {
    const filters = this.state.filters;
    filters[this.state.fullscreen][event.target.name] = event.target.value;
    this.setState({
      filters: filters,
    });
  }

  componentDidMount() {
    console.log('mount')
    this.videos.filter(Boolean).forEach((video, index) => {
      this.initVideo(video, this.state.links[index]);
    })
  }

  render() {
    const elements = this.state.links.map((src, index) => {
      const { brightness, contrast } = this.state.filters[index];

      const style = {
        filter: `brightness(${brightness}) contrast(${contrast})`,
      };

      return <div
        className={`video__wrapper ${index === this.state.fullscreen ? 'video--open' : ''}`}
        key={src}
        onClick={this.handleClick.bind(this, index)}
        style={style}
        >
        <video
          className="video"
          autoPlay="autoplay"
          muted={index !== this.state.fullscreen}
          loop="loop"
          ref={(video) => {
            this.videos = this.videos || [];
            this.videos.push(video);
            this.videos = this.videos.filter(Boolean).slice(-4);
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
          <input
            type="range"
            min="0"
            name="brightness"
            max="3"
            value={this.state.fullscreen >= 0 ? this.state.filters[this.state.fullscreen].brightness : 0}
            onInput={this.handleInputChange.bind(this)}
          />
        </label>

        <label>
          Контрастность
          <input
            type="range"
            min="0"
            name="contrast"
            max="3"
            value={this.state.fullscreen >= 0 ? this.state.filters[this.state.fullscreen].contrast : 0}
            onInput={this.handleInputChange.bind(this)}
          />
        </label>

        <Analyser elements={this.videos}/>
      </div>
      <div className="video__container">
        {elements}
      </div>
    </main>
  }
}

export default Monitoring;
