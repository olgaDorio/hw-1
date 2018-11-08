import React from "react";

import richdata from './../assets/Richdata.svg';
import prev from './../assets/prev.svg';
import bitmap from './../assets/bitmap.jpg';
import bitmap2 from './../assets/bitmap2.jpg';
import bitmap3 from './../assets/bitmap3.jpg';

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

const icons = {
  stats,
  key,
  robotCleaner,
  router,
  thermal,
  ac,
  music,
  fridge,
  battery,
  cam,
  kettle,
}

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  componentDidMount() {
    // console.log('mount')
    fetch('https://agile-plains-47360.herokuapp.com/api/events')
      .then(r => r.json())
      .then(({ array }) => {
        this.setState({
          events: array,
        });
      })
      .catch(console.log);
  }

  createCards() {
    return this.state.events.map((event, index) => {
      let body;
      let description;
      let image;
      let indicator;
      let player;
      let buttons;

      if (event.description) {
        description = <div className="card__description">{event.description}</div>
      }

      if (event.data && event.data.type === 'graph') {
        image = <img src={richdata} alt="" className="card__image"/>
      }

      if (event.data && event.data.temperature) {
        indicator = <div className="indicator__group">
          <div className="indicator">
            Температура:&nbsp;
            <div className="indicator__value">
              {event.data.temperature} C
            </div>
          </div>
          <div className="indicator">
            Влажность:&nbsp;
            <div className="indicator__value">
              {event.data.humidity}%
            </div>
          </div>
        </div>
      }

      if (event.data && event.data.albumcover) {
        player = <div className="player">
          <div className="player__row">
          <img className="player__albumcover" src={event.data.albumcover} alt="albumcover"/>
            <div className="player__column">
              <div className="player__artist">{event.data.artist}</div>
              <input className="range" type="range" defaultValue="50"/>
            </div>
            <div className="player__duration">{event.data.track.length}</div>
          </div>
          <div className="player__row">
            <button className="button player__control">
              <img src={prev} alt=""/>
            </button>
            <button className="button player__control">
              <img src={prev} style={{transform: 'rotate(-180deg)'}} alt=""/>
            </button>
            <div className="player__column">
              <input className="range range--round" type="range" min="0" max="100" defaultValue={event.data.volume}/>
            </div>
            <div className="player__volume">{event.data.volume}%</div>
          </div>
        </div>
      }

      if (event.data && event.data.buttons && event.data.buttons.length === 2) {
        buttons = <div className="button__group">
          <button className="button button--active">{event.data.buttons[0]}</button>
          <button className="button">{event.data.buttons[1]}</button>
        </div>
      }

      if (event.data && event.data.image) {
        const srcset = `${bitmap} 820w, ${bitmap2} 1664w, ${bitmap3} 2496w`;

        // TODO: fix it with BEM
        image = <img className="card__image show-on-desktop"
          srcSet={srcset}
          sizes="(max-width: 900px) 90vw, 30vw"
          src={bitmap3}
          alt=""/>
      }

      if (description || image || indicator || player || buttons) {
        body = <div className="card__body">
          {description}
          {image}
          {indicator}
          {player}
          {buttons}
        </div>
      }

      return <div key={index} className={`card card--${event.type} card--${event.size} ${!event.description && !event.data ? 'card--small' : ''}`}>
        <button className="button card__control"></button>
        <button className="button card__control"></button>
        <div className="card__header">
          <div className="card__title">
            <img className="icon" src={icons[event.icon]} alt=""/>
            <span>{event.title}</span>
          </div>
          <div className="card__subtitle">
            <div>{event.source}</div>
            <div>{event.time}</div>
          </div>
        </div>
        {body}
      </div>
    })
  }

  render() {
    return <main className="page__main">
      <h1 className="title">Лента событий</h1>
      { this.createCards(this.state.events) }
    </main>
  }
}

export default Events;
