import React from "react";
import { cn } from '@bem-react/classname';
import Button from './../Button/Button';

class ButtonGroup extends React.Component {
  render() {
    const buttons = this.props.buttons || [];
    const activeButton = this.props.activeButton || 0;

    return (
      <div className={cn('Button', 'Group')()}>
        {this.props.children}

        {
          buttons.map((text, index) => (
            <Button active={index === activeButton} key={index}>
              {text}
            </Button>
          ))
        }
      </div>
    );
  }
}

export default ButtonGroup;
