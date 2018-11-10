import React from "react";
import { cn } from '@bem-react/classname';
import './chart.css';

class Analyser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      volume: 50,
    };
  }

  render() {
    const chartCn = cn('Chart');
    const style = {'animationDelay': `-${this.state.volume}ms`};
    return (
      <div className={chartCn()}>
        <div className={chartCn('Bar')} style={style}></div>
      </div>
    )
  }
}

export default Analyser
