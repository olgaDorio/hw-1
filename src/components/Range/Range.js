import React from 'react';
import { cn } from '@bem-react/classname';
import './range.css';

class Range extends React.Component {
  render() {
    const cnRange = cn('Range');
    const { round, min, max, name, value, defaultValue, onInput } = this.props;

    return (
      <label className={cnRange('Label')}>
        {this.props.children}
        <input
          className={cnRange({round})}
          type="range"
          step="0.01"

          min={min}
          max={max}
          name={name}
          value={value}
          defaultValue={defaultValue}

          onChange={onInput}
        />
      </label>
    );
  }
}

export default Range;
