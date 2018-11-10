import React from "react";
import { cn } from '@bem-react/classname';
import './icon.css';

import ac from './../../assets/ac.svg';
import battery from './../../assets/battery.svg';
import cam from './../../assets/cam.svg';
import fridge from './../../assets/fridge.svg';
import kettle from './../../assets/kettle.svg';
import key from './../../assets/key.svg';
import logo from './../../assets/logo.png';
import music from './../../assets/music.svg';
import robotCleaner from './../../assets/robot-cleaner.svg';
import router from './../../assets/router.svg';
import stats from './../../assets/stats.svg';
import thermal from './../../assets/thermal.svg';

const icons = {
  'robot-cleaner': robotCleaner, ac, battery, cam,
  fridge, kettle, key, logo, music, router, stats, thermal,
};

class Icon extends React.Component {
  render() {
    const icon = cn('Icon');

    const className = icon({
      logo: !!this.props.logo,
    });

    return (
      <img src={icons[this.props.name]} alt="" className={className}/>
    );
  }
}

export default Icon;
