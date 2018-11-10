import React from "react";
import { cn } from '@bem-react/classname';

// а кто индикатор импортит?

class Indicator extends React.Component {
  render() {
    const hasValidProps =
      this.props.data.hasOwnProperty('temperature') &&
      this.props.data.hasOwnProperty('humidity');

    if (!hasValidProps) return null;

    const indicator = cn('Indicator');
    const { temperature, humidity } = this.props.data;

    return (
      <div className={indicator('Group')}>
        <div className={indicator()}>
          Температура:&nbsp;
          <div className={indicator('Value')}>
            {temperature} C
          </div>
        </div>
        <div className={indicator()}>
          Влажность:&nbsp;
          <div className={indicator('Value')}>
            {humidity}%
          </div>
        </div>
      </div>
    )
  }
}

export default Indicator;
