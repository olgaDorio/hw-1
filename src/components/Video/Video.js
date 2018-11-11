import React from 'react';
import Hls from 'hls.js'
import { cn } from '@bem-react/classname';
import './video.css';

const cnVideo = cn('Video');

class Monitoring extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hls: null,
    }
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

    this.setState({
      hls,
    })
  }

  play() {
    this.video.play();
  }

  handleClick() {
    if (this.video.paused) {
      this.play();
    } else {
      this.props.onClick();
    }
  }

  componentDidMount() {
    this.initVideo(this.video, this.props.src);
  }

  componentWillUnmount() {
    if (!this.state.hls) return;
    this.state.hls.stopLoad();
  }

  render() {

    const { brightness, contrast } = this.props.filters;

    const style = {
      filter: `brightness(${brightness}) contrast(${contrast})`,
    };

    return (
      <div className={cnVideo('Wrapper', {open: this.props.fullscreen})}>
        <video
          className={cnVideo()}
          autoPlay="autoplay"
          muted={this.props.fullscreen}
          style={style}
          loop="loop"
          ref={(video) => {
            this.video = video;
          }}
          onClick={this.handleClick.bind(this)}
          onLoadedMetadata={this.play.bind(this)}
          src=""/>
      </div>
    )
  }
}

export default Monitoring;
