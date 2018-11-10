import React from "react";
import { cn } from '@bem-react/classname';
import './range.css';

class Range extends React.Component {
  render() {
    const range = cn('Range');
    const { round, min, max, name, value, defaultValue, onInput } = this.props;

    return (
      <label className={range('Label')}>
        {this.props.children}
        <input
          className={range({round})}
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
