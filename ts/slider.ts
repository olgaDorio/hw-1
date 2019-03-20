interface SliderEvent extends Event {
  x: number;
  offsetX: number;
  changedTouches: [{
    clientX: number;
  }];
}

interface GetPositionArgs {
  event: SliderEvent;
  diff: number;
  sliderLeft: number;
  min: number;
  max: number;
}

interface GetStyleArgs {
  value: number;
  sliderWidth: number;
  radius: number;
  max: number;
}

class Slider {
  slider: HTMLElement;
  circle: HTMLElement|null;
  radius: number;
  name: string;
  minValue: number;
  maxValue: number;
  down: Boolean;
  diff: number;
  min: number;
  onChange?: (value: number) => void;

  constructor(slider: HTMLElement, onChange?: (value: number) => void) {
    this.slider = slider;
    this.circle = slider.querySelector('.circle');
    this.radius = this.circle!.offsetWidth / 2;
    this.onChange = onChange;
    this.name = slider.dataset.name || '';
    this.minValue = Number(slider.dataset.min) || 0;
    this.maxValue = Number(slider.dataset.max) || 1;

    this.down = false;
    this.diff = 0;

    this.min = 0;

    this.slider.addEventListener('touchstart', this.start.bind(this));
    this.slider.addEventListener('mousedown', this.start.bind(this));
    document.addEventListener('mouseup', this.stop.bind(this));
    document.addEventListener('touchend', this.stop.bind(this));
    document.addEventListener('touchmove', this.move.bind(this));
    document.addEventListener('mousemove', this.move.bind(this));

    this.setValue(Number(slider.dataset.initialValue), true);

    window.addEventListener('resize', () => {
      const { value } = this.slider.dataset;
      this.setValue(Number(value) || 0);
    });
  }

  start(e: Event) {
    this.down = true;
    this.diff = e.target === this.circle ? (<SliderEvent>e).offsetX || this.radius : this.radius;
  }

  move(e: Event) {
    e.preventDefault();
    if (!this.down) return;
    const value: number = this.getLeftPosition({
      event: (<SliderEvent>e),
      diff: this.diff,
      sliderLeft: this.slider.offsetLeft,
      min: this.min,
      max: this.max(),
    }) / this.max();
    this.setValue(value);

    if (this.onChange) {
      this.onChange(value * (this.maxValue - this.minValue));
    }
  }

  stop(e: Event) {
    if (e.target !== this.slider && e.target !== this.circle) {
      this.down = false;
      return;
    }

    if (!this.down) {
      this.diff = this.radius;
    }

    this.move(<SliderEvent>e);
    this.down = false;
    this.diff = 0;
  }

  max() {
    return this.sliderWidth() - (this.radius * 2);
  }

  sliderWidth() {
    return this.slider.offsetWidth;
  }

  getLeftPosition({
    event, diff, sliderLeft, min, max,
  }: GetPositionArgs) {
    const pageX = event.x || event.changedTouches[0].clientX;
    const relativeX = pageX - sliderLeft - diff;
    return Math.min(Math.max(relativeX, min), max);
  }

  getStyle({
    value, sliderWidth, radius, max,
  }: GetStyleArgs) {
    if (value > 1 || value < 0) {
      console.error('currentValue should correspond to the interval [0; 1]');
      return false;
    }

    const left = 100 * value * max / sliderWidth;
    const radiusP = 100 * radius / sliderWidth;
    const bgPosition = 100 - left - radiusP;

    return { left: `${left}%`, backgroundPosition: `${bgPosition}%` };
  }

  setValue(value: number, recalc?: Boolean) {
    const rvalue = recalc ? value / (this.maxValue - this.minValue) : value;

    const style = this.getStyle({
      value: rvalue,
      max: this.max(),
      radius: this.radius,
      sliderWidth: this.sliderWidth(),
    });

    if (!style || !this.circle) return;

    this.slider.dataset.value = `${rvalue}`;
    this.circle.style.left = style.left;
    this.slider.style.backgroundPosition = style.backgroundPosition;
  }
}

export default Slider;
