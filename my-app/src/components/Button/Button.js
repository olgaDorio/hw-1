import React from "react";
import { cn, classnames } from '@bem-react/classname';
import './button.css';

class Button extends React.Component {
  render() {
    const button = cn('Button');

    const className = button({
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
