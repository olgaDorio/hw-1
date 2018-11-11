import React from "react";
import { cn, classnames } from '@bem-react/classname';

import Range from './../Range/Range';
import Video from './../Video/Video';
import Button from './../Button/Button';
import Analyser from './../Analyser/Analyser';

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

  render() {
    const cnVideo = cn('Video');

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
        cnVideo('Controls'),
        cnVideo('Controls', {
          shown: this.state.fullscreen >= 0
        }));

    return <main className={this.props.routeClassName}>
      <div className={className}>
        <Button default={true} onClick={this.handleClick.bind(this, -1)}>
          Все камеры
        </Button>

        {sliders}

        <Analyser/>
      </div>

      <div className={cnVideo('Container')}>
        {
          this.state.links.map((link, index) => {
            const filters = this.state.filters[index];
            const isFullscreen = this.state.fullscreen === index;
            return (
              <Video
                src={link}
                key={index}
                filters={filters}
                fullscreen={isFullscreen}
                onClick={this.handleClick.bind(this, index)}
              />
            )
          })
        }
      </div>
    </main>
  }
}

export default Monitoring;
