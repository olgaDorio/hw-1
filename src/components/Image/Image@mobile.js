import React from 'react';
import Indicator from './../Indicator/Indicator.js';
import { cn, classnames } from '@bem-react/classname';
import bitmap from './../../assets/bitmap.jpg';
import bitmap2 from './../../assets/bitmap2.jpg';
import bitmap3 from './../../assets/bitmap3.jpg';
import './image.css';

const SCROLL_SPEED = 25;
const MAX_BRIGHTNESS = 2;
const MIN_BRIGHTNESS = 0.3;
const BRIGHTNESS_STEP = 0.05;

const cnTouchImage = cn('TouchImage');

class MobileImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      touches: {},
      left: 0,
      zoom: 100,
      brightness: 1,

      prevYDiff: 0,
    };
  }

  getTrackStyle() {
    if (!this.imageNode || !this.track) return {};

    const trackWidth = this.track.offsetWidth;
    const imageWidth = this.imageNode.offsetWidth;
    const parentWidth = this.imageNode.parentNode.offsetWidth;

    const left = (trackWidth - parentWidth) * this.state.left / (imageWidth - parentWidth);

    return {
      left: `${left}px`
    };
  }

  getImageStyle() {
    return {
      transform: `translateX(${this.state.left}px)`,
      filter: `brightness(${this.state.brightness})`,
    };
  }

  // methods

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
    const clientYs = Object.values(this.state.touches).map(({ clientY }) => clientY);
    const currDiff = Math.abs(clientYs[0] - clientYs[1]);

    let newValue;

    if (!this.state.prevYDiff) {
      newValue = this.state.brightness;
    } else if (currDiff > this.state.prevYDiff) {
      newValue = Math.min(this.state.brightness + BRIGHTNESS_STEP, MAX_BRIGHTNESS);
    } else {
      newValue = Math.max(this.state.brightness - BRIGHTNESS_STEP, MIN_BRIGHTNESS);
    }

    this.setState({
      brightness: newValue,
      prevYDiff: currDiff,
    })
  }

  scrollForward() {
    const { left } = this.state;

    if (left < 0) {
      return;
    }
    const changed = left - SCROLL_SPEED;

    this.setState({
      left: changed > 0 ? changed : left - 1,
    });

    requestAnimationFrame(this.scrollForward.bind(this));
  }

  scrollBack() {
    const elementWidth = this.imageNode.offsetWidth;
    const parentWidth = this.imageNode.parentNode.offsetWidth;

    const { left } = this.state;
    const maxLeft = parentWidth - elementWidth;

    if (left > maxLeft) {
      return;
    }

    const changed = left + SCROLL_SPEED;
    this.setState({
      left: changed < maxLeft ? changed : left + 1
    });

    requestAnimationFrame(this.scrollBack.bind(this));
  };

  onpointerdown(e) {
    const { touches }= this.state;
    touches[e.nativeEvent.pointerId] = e.nativeEvent;

    this.setState({
      touches,
    });

    e.target.setPointerCapture(e.nativeEvent.pointerId);
  }

  onpointermove(e) {
    const amount = Object.keys(this.state.touches).length;

    if (amount === 1) {
      this.changeLeftPosition(e.nativeEvent);
    } else if (amount === 2) {
      const { touches }= this.state;
      touches[e.nativeEvent.pointerId] = e.nativeEvent;

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
    return (
      <div>
        <div className={cnTouchImage('Contrainer')}>
          <img className={classnames(this.props.className, cnTouchImage())}
            srcSet={`${bitmap} 820w, ${bitmap2} 1664w, ${bitmap3} 2496w`}
            sizes="(max-width: 900px) 90vw, 30vw" src={bitmap3} alt=""
            draggable="false"
            ref={(node) => {this.imageNode = node}}
            onPointerUp={this.onpointerup.bind(this)}
            onPointerDown={this.onpointerdown.bind(this)}
            onPointerMove={this.onpointermove.bind(this)}
            onPointerCancel={this.onpointerup.bind(this)}
            style={this.getImageStyle()}
            />
          <div className={cnTouchImage('Track')}
            style={this.getTrackStyle()}
            ref={(node) => {this.track = node}}/>
        </div>

        <Indicator data={[
          {
            value: this.state.zoom,
            title: 'Приближение',
            after: '%'
          },
          {
            value: Math.round(this.state.brightness * 100),
            title: 'Яркость',
            after: '%'
          }
        ]}/>
      </div>
    )
  }
}

export default MobileImage;
