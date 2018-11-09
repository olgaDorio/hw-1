import React from "react";
import { cn } from '@bem-react/classname';
import './../css/button.css';

class ButtonGroup extends React.Component {
  render() {
    return (
      <div className={cn('Button', 'Group')()}>
        {this.props.children}
      </div>
    );
  }
}

export default ButtonGroup;
