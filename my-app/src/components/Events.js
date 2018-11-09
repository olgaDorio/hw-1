import React from "react";
import { cn } from '@bem-react/classname';

import Icon from './Icon';
import Range from './Range';
import Button from './Button';
import ButtonGroup from './ButtonGroup';

import prev from './../assets/prev.svg';
import bitmap from './../assets/bitmap.jpg';
import bitmap2 from './../assets/bitmap2.jpg';
import bitmap3 from './../assets/bitmap3.jpg';
import richdata from './../assets/Richdata.svg';

import './../css/player.css';

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  componentDidMount() {
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

      const cardCn = cn('Card');

      if (event.description) {
        description = <div className={cardCn('Description')}>{event.description}</div>
      }

      if (event.data && event.data.type === 'graph') {
        image = <img src={richdata} alt="" className={cardCn('Image')}/>
      }

      if (event.data && event.data.temperature) {
        const indicatorCn = cn('Indicator');

        indicator = <div className={indicatorCn('Group')}>
          <div className={indicatorCn()}>
            Температура:&nbsp;
            <div className={indicatorCn('Value')}>
              {event.data.temperature} C
            </div>
          </div>
          <div className={indicatorCn()}>
            Влажность:&nbsp;
            <div className={indicatorCn('Value')}>
              {event.data.humidity}%
            </div>
          </div>
        </div>
      }

      if (event.data && event.data.albumcover) {
        const playerCn = cn('Player');

        player = <div className={playerCn()}>
          <div className={playerCn('Row')}>
          <img className={playerCn('Albumcover')} src={event.data.albumcover} alt="albumcover"/>
            <div className={playerCn('Column')}>
              <div className={playerCn('Artist')}>{event.data.artist}</div>
              <Range defaultValue="50" min="0" max="100"/>
            </div>
            <div className={playerCn('Duration')}>{event.data.track.length}</div>
          </div>
          <div className={playerCn('Row')}>
            <Button className={playerCn('Control')}>
              <img src={prev} alt=""/>
            </Button>
            <Button className={playerCn('Control')}>
              <img src={prev} style={{transform: 'rotate(-180deg)'}} alt=""/>
            </Button>
            <div className={playerCn('Column')}>
              <Range round min="0" max="100" defaultValue={event.data.volume}/>
            </div>
            <div className={playerCn('Volume')}>{event.data.volume}%</div>
          </div>
        </div>
      }

      if (event.data && event.data.buttons && event.data.buttons.length === 2) {
        buttons = (
          <ButtonGroup>
            <Button active="true">
              {event.data.buttons[0]}
            </Button>
            <Button>
              {event.data.buttons[1]}
            </Button>
          </ButtonGroup>
        )
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
        body = <div className={cardCn('Body')}>
          {description}
          {image}
          {indicator}
          {player}
          {buttons}
        </div>
      }

      return <div key={index} className={cardCn({size: event.size, type: event.type, compact: !event.description && !event.data})}>
        <Button className={cardCn('Control')}></Button>
        <Button className={cardCn('Control')}></Button>
        <div className={cardCn('Header')}>
          <div className={cardCn('Title')}>
            <Icon name={event.icon}/>
            <span>{event.title}</span>
          </div>
          <div className={cardCn('Subtitle')}>
            <div>{event.source}</div>
            <div>{event.time}</div>
          </div>
        </div>
        {body}
      </div>
    })
  }

  render() {
    return (
      <main className={this.props.routeClassName}>
        <h1 className="Title">Лента событий</h1>
        { this.createCards(this.state.events) }
      </main>
    )
  }
}

export default Events;
