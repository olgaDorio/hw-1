import React from "react";
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';

import Icon from './../Icon/Icon';
import Button from './../Button/Button';
import CardGraph from './../Graph/Graph';
import CardPlayer from './../Player/Player';
import ButtonGroup from './../ButtonGroup/ButtonGroup';
import CardIndicator from './../Indicator/Indicator';

import './card@basic.css';

const cnCard = cn('Card');

class BodyWrapper extends React.Component {
  render() {
    return (
      <div className={cnCard('Body')}>
        {this.props.children}
      </div>
    )
  }
}

class Card extends React.Component {
  render() {
    const event = this.props.event;

    const isImage = event.data && event.data.image;
    const isGraph = event.data && event.data.type && event.data.type === 'graph';
    const isTemperature = event.data && event.data.hasOwnProperty('temperature');
    const isCompact = !event.description && !event.data;

    const body = isCompact ? null :
      <BodyWrapper>
        {event.description && <div className={cnCard('Description')}>{event.description}</div>}

        <CardPlayer data={event.data || {}}/>
        <ButtonGroup buttons={(event.data || {}).buttons}/>

        {isGraph && <CardGraph className={cnCard('Image')}/>}

        {isImage && <RegistryConsumer>
            {registries => {
                const registry = registries['App'];
                const CardImage = registry.get('Image');
                return <CardImage className={cnCard('Image')}/>;
            }}
        </RegistryConsumer>}

        {isTemperature && <CardIndicator data={[
          {
            value: event.data.temperature,
            title: 'Температура',
            after: ' C',
          },
          {
            value: event.data.humidity,
            title: 'Влажность',
            after: '%',
          },
        ]}/>}
    </BodyWrapper>

    return <div className={cnCard({size: event.size, type: event.type, compact: isCompact})}>
      <Button className={cnCard('Control')}></Button>
      <Button className={cnCard('Control')}></Button>
      <div className={cnCard('Header')}>
        <div className={cnCard('Title')}>
          <Icon name={event.icon}/>
          <span>{event.title}</span>
        </div>
        <div className={cnCard('Subtitle')}>
          <div>{event.source}</div>
          <div>{event.time}</div>
        </div>
      </div>
      {body}
    </div>
  }
}

export default Card;
