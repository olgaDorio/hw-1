import React from "react";
import { cn } from '@bem-react/classname';
import './../css/icon.css';

import stats from './../assets/stats.svg';
import key from './../assets/key.svg';
import robotCleaner from './../assets/robot-cleaner.svg';
import router from './../assets/router.svg';
import thermal from './../assets/thermal.svg';
import ac from './../assets/ac.svg';
import music from './../assets/music.svg';
import fridge from './../assets/fridge.svg';
import battery from './../assets/battery.svg';
import cam from './../assets/cam.svg';
import kettle from './../assets/kettle.svg';
import logo from './../assets/logo.png';

const icons = {
  stats,
  key,
  router,
  thermal,
  ac,
  music,
  fridge,
  battery,
  cam,
  kettle,
  logo,
  'robot-cleaner': robotCleaner,
}

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
