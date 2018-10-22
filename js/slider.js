function Slider({ slider, onChange }) {
  this.slider = slider;
  this.circle = slider.querySelector('.circle');
  this.radius = this.circle.offsetWidth / 2;
  this.onChange = onChange;
  this.name = slider.dataset.name || '';
  this.minValue = slider.dataset.min || 0;
  this.maxValue = slider.dataset.max || 1;

  this.down = false;
  this.diff = 0;

  this.max = () => (
    this.sliderWidth() - (this.radius * 2)
  );

  this.sliderWidth = () => (
    this.slider.offsetWidth
  );

  this.min = 0;

  const getLeftPosition = ({
    event, diff, sliderLeft, min, max,
  }) => {
    const pageX = event.x || event.changedTouches[0].clientX;
    const relativeX = pageX - sliderLeft - diff;
    return Math.min(Math.max(relativeX, min), max);
  };

  const getStyle = ({
    value, sliderWidth, radius, max,
  }) => {
    if (value > 1 || value < 0) {
      console.error('currentValue should correspond to the interval [0; 1]');
      return false;
    }

    const left = 100 * value * max / sliderWidth;
    const radiusP = 100 * radius / sliderWidth;
    const bgPosition = 100 - left - radiusP;

    return { left: `${left}%`, backgroundPosition: `${bgPosition}%` };
  };

  const start = (e) => {
    this.down = true;
    this.diff = e.target === this.circle ? e.offsetX || this.radius : this.radius;
  };

  const move = (e) => {
    e.preventDefault();
    if (!this.down) return;
    const value = getLeftPosition({
      event: e,
      diff: this.diff,
      sliderLeft: this.slider.offsetLeft,
      min: this.min,
      max: this.max(),
    }) / this.max();
    this.setValue(value);

    if (this.onChange) {
      this.onChange(value * (this.maxValue - this.minValue));
    }
  };

  const stop = (e) => {
    if (e.target !== this.slider && e.target !== this.circle) {
      this.down = false;
      return;
    }

    if (!this.down) {
      this.diff = this.radius;
    }

    move(e);
    this.down = false;
    this.diff = 0;
  };

  this.setValue = (value, recalc) => {
    const rvalue = recalc ? value / (this.maxValue - this.minValue) : value;

    const style = getStyle({
      value: rvalue,
      max: this.max(),
      radius: this.radius,
      sliderWidth: this.sliderWidth(),
    });

    if (!style) return;

    this.slider.dataset.value = rvalue;
    this.circle.style.left = style.left;
    this.slider.style.backgroundPosition = style.backgroundPosition;
  };

  this.slider.addEventListener('touchstart', start);
  this.slider.addEventListener('mousedown', start);
  document.addEventListener('mouseup', stop);
  document.addEventListener('touchend', stop);
  document.addEventListener('touchmove', move);
  document.addEventListener('mousemove', move);

  this.setValue(slider.dataset.initialValue, true);

  window.addEventListener('resize', () => {
    const { value } = this.slider.dataset;
    this.setValue(value || 0);
  });
}
