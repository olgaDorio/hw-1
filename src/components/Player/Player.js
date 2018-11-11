import React from "react";
import { cn } from '@bem-react/classname';
import Range from './../Range/Range';
import Button from './../Button/Button';
import prev from './../../assets/prev.svg';

import './player.css';


class Player extends React.Component {
  render() {
    const { albumcover, artist, track, volume } = this.props.data;
    const cnPlayer = cn('Player');

    const hasValidProps = albumcover && artist && volume && track && track.hasOwnProperty('length');

    if (!hasValidProps) return null;

    return (
      <div className={cnPlayer()}>
        <div className={cnPlayer('Row')}>
        <img className={cnPlayer('Albumcover')} src={albumcover} alt="albumcover"/>
          <div className={cnPlayer('Column')}>
            <div className={cnPlayer('Artist')}>{artist}</div>
            <Range defaultValue="50" min="0" max="100"/>
          </div>
          <div className={cnPlayer('Duration')}>{track.length}</div>
        </div>
        <div className={cnPlayer('Row')}>
          <Button className={cnPlayer('Control')}>
            <img src={prev} alt=""/>
          </Button>
          <Button className={cnPlayer('Control')}>
            <img src={prev} style={{transform: 'rotate(-180deg)'}} alt=""/>
          </Button>
          <div className={cnPlayer('Column')}>
            <Range round min="0" max="100" defaultValue={volume}/>
          </div>
          <div className={cnPlayer('Volume')}>{volume}%</div>
        </div>
      </div>
    )
  }
}

export default Player;
