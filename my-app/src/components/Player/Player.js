import React from "react";
import { cn } from '@bem-react/classname';
import Range from './../Range/Range';
import Button from './../Button/Button';

import prev from './../../assets/prev.svg';

import './player.css';


class Player extends React.Component {
  render() {
    const { albumcover, artist, track, volume } = this.props.data;
    const player = cn('Player');

    const hasValidProps = albumcover && artist && volume && track && track.hasOwnProperty('length');

    if (!hasValidProps) return null;

    return (
      <div className={player()}>
        <div className={player('Row')}>
        <img className={player('Albumcover')} src={albumcover} alt="albumcover"/>
          <div className={player('Column')}>
            <div className={player('Artist')}>{artist}</div>
            <Range defaultValue="50" min="0" max="100"/>
          </div>
          <div className={player('Duration')}>{track.length}</div>
        </div>
        <div className={player('Row')}>
          <Button className={player('Control')}>
            <img src={prev} alt=""/>
          </Button>
          <Button className={player('Control')}>
            <img src={prev} style={{transform: 'rotate(-180deg)'}} alt=""/>
          </Button>
          <div className={player('Column')}>
            <Range round min="0" max="100" defaultValue={volume}/>
          </div>
          <div className={player('Volume')}>{volume}%</div>
        </div>
      </div>
    )
  }
}

export default Player;
