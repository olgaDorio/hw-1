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

const cardCn = cn('Card');

class BodyWrapper extends React.Component {
  render() {
    return (
      <div className={cardCn('Body')}>
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
    const isCompact = !event.description && !event.data;

    const body = isCompact ? null :
      <BodyWrapper>
        {event.description && <div className={cardCn('Description')}>{event.description}</div>}

        <CardPlayer data={event.data || {}}/>
        <CardIndicator data={event.data || {}}/>
        <ButtonGroup buttons={(event.data || {}).buttons}/>

        {isGraph && <CardGraph className={cardCn('Image')}/>}

        {isImage && <RegistryConsumer>
            {registries => {
                const registry = registries['App'];
                const CardImage = registry.get('Image');
                return <CardImage className={cardCn('Image')}/>;
            }}
        </RegistryConsumer>}
    </BodyWrapper>

    return <div className={cardCn({size: event.size, type: event.type, compact: isCompact})}>
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
  }
}

export default Card;
