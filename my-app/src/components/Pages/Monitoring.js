import React from "react";
import { cn, classnames } from '@bem-react/classname';
import Hls from 'hls.js'

import Range from './../Range/Range';
import Button from './../Button/Button';
import Analyser from './../Analyser/Analyser';

import './video.css'

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
    this.videos.filter(Boolean).forEach((video, index) => {
      this.initVideo(video, this.state.links[index]);
    })
  }

  render() {
    const videoCn = cn('Video');

    const elements = this.state.links.map((src, index) => {
      const { brightness, contrast } = this.state.filters[index];

      const style = {
        filter: `brightness(${brightness}) contrast(${contrast})`,
      };

      return <div
        className={videoCn('Wrapper', {open: index === this.state.fullscreen})}
        key={src}
        onClick={this.handleClick.bind(this, index)}
        >
        <video
          className={videoCn()}
          autoPlay="autoplay"
          muted={index !== this.state.fullscreen}
          style={style}
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


    const sliderOptions = [
      {
        label: 'Яркость',
        name: 'brightness'
      },
      {
        label: 'Контрастность',
        name: 'contrast'
      }
    ];

    const sliders = sliderOptions.map(({ label, name }) => {
      const { fullscreen, filters } = this.state;
      const value = fullscreen >= 0 ? filters[fullscreen][name] : 0
      const onInput = this.handleInputChange.bind(this);
      return (
        <Range key={name} round={true} min="0" max="3" name={name} value={value} onInput={onInput}>
          {name}
        </Range>
      )
    })

    const className = classnames(
        videoCn('Controls'),
        videoCn('Controls', {
          shown: this.state.fullscreen >= 0
        }));

    return <main className={this.props.routeClassName}>
      <div className={className}>
        <Button default={true} onClick={this.handleClick.bind(this, -1)}>
            Все камеры
        </Button>

        {sliders}
        <Analyser elements={this.videos}/>
      </div>
      <div className={videoCn('Container')}>
        {elements}
      </div>
    </main>
  }
}

export default Monitoring;
