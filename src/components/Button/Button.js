import React from "react";
import { cn, classnames } from '@bem-react/classname';
import './button.css';

class Button extends React.Component {
  render() {
    const cnButton = cn('Button');

    const className = cnButton({
      active: !!this.props.active,
      default: !!this.props.default,
    });

    return (
      <button className={classnames(className, this.props.className)} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

export default Button;
