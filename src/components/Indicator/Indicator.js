import React from 'react';
import { cn } from '@bem-react/classname';
import './indicator.css';

const cnIndicator = cn('Indicator');

class Indicator extends React.Component {
  render() {
    if (!this.props.data.length && this.props.data.some(p => {
      return !p.hasOwnProperty('value') || !p.hasOwnProperty('title')
    })) return null;

    return (
      <div className={cnIndicator('Group')}>
        {
          (this.props.data || []).map(({value, title, after=''}) => {
            return (
              <div className={cnIndicator()} key={title}>
                {title}:&nbsp;
                <div className={cnIndicator('Value')}>
                  {value}{after}
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Indicator;
