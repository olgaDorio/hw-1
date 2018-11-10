import React from "react";
import { cn, classnames } from '@bem-react/classname';
import bitmap from './../../assets/bitmap.jpg';
import bitmap2 from './../../assets/bitmap2.jpg';
import bitmap3 from './../../assets/bitmap3.jpg';
import './image.css';

const SCROLL_SPEED = 25;

// TODO: rename style file
// TODO: fix movement bugs
// TODO: add indicators to layout
// TODO: add scroll indicator to image
// TODO: add brightness changes

class MobileImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      touches: {},
      left: 0,
    };
  }

  changeLeftPosition(e) {
    const touch = this.state.touches[e.pointerId];
    const touches = this.state.touches;
    touches[e.pointerId] = e;

    this.setState({
      touches,
      left: this.state.left + e.pageX - touch.pageX,
    });
  }

  changeBrightness() {
  }

  scrollForward() {
    if (this.state.left < 0) return;
    const currentLeft = this.state.left;
    const value = currentLeft - SCROLL_SPEED;
    this.setState({
      left: value > 0 ? value : currentLeft - 1,
    })
    requestAnimationFrame(this.scrollForward.bind(this));
  }

  scrollBack() {
    const elementWidth = this.imageNode.getBoundingClientRect().width;
    const parentWidth = this.imageNode.parentNode.getBoundingClientRect().width;
    const maxLeft = parentWidth - elementWidth;
    const currentLeft = this.state.left;
    if (currentLeft > maxLeft) return;
    const value = currentLeft + SCROLL_SPEED;
    this.setState({
      left: value < maxLeft ? value : currentLeft + 1
    })
    requestAnimationFrame(this.scrollBack.bind(this));
  };

  onpointerdown(e) {
    const { touches }= this.state;
    touches[e.pointerId] = e;

    this.setState({
      touches,
    });

    e.target.setPointerCapture(e.pointerId);
  }

  onpointermove(e) {
    const amount = Object.keys(this.state.touches).length;

    if (amount === 1) {
      this.changeLeftPosition(e.nativeEvent);
    } else if (amount === 2) {
      const { touches }= this.state;
      touches[e.pointerId] = e;

      this.setState({
        touches,
      });

      this.changeBrightness();
    }
  }

  onpointerup() {
    const currentLeft = this.state.left;
    const elementWidth = this.imageNode.getBoundingClientRect().width;
    const parentWidth = this.imageNode.parentNode.offsetWidth;

    if (currentLeft > 0) {
      this.scrollForward();
    } else if (Math.abs(currentLeft) > elementWidth - parentWidth) {
      this.scrollBack();
    }

    this.setState({
      touches: {},
    })
  }

  render() {
    const touchImage = cn('TouchImage');

    return (
      <div className={touchImage('Contrainer')}>

        <img className={classnames(this.props.className, touchImage())}
          srcSet={`${bitmap} 820w, ${bitmap2} 1664w, ${bitmap3} 2496w`}
          sizes="(max-width: 900px) 90vw, 30vw" src={bitmap3} alt=""
          draggable="false"
          ref={(node) => {this.imageNode = node}}
          onPointerUp={this.onpointerup.bind(this)}
          onPointerDown={this.onpointerdown.bind(this)}
          onPointerMove={this.onpointermove.bind(this)}
          onPointerCancel={this.onpointerup.bind(this)}
          style={{transform: `scale(2) translateX(${this.state.left}px)`}}
          />
      </div>
    )
  }
}

export default MobileImage;
