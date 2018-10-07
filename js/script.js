const isMobile = navigator.maxTouchPoints > 0;

if (isMobile) {
  console.log('add no hover class to body');
}

const target = document.querySelector('.image-m__container');
const img = target.querySelector('.image-m');
const slider = document.querySelector('.image-m__track');
const brightnessInfo = document.querySelector('.brightness');

const touches = {};

const minLeft = 0;
const minBrightness = 0.7;
const maxBrightness = 1.3;
const brightnessStep = 0.01;

let currentLeft = 0;
let brightness = 1;

let prevYDiff = null;

const angleDeg = ([p1, p2]) => (
  Math.atan2(p2.pageY - p1.pageY, p2.pageX - p1.pageX) * 180 / Math.PI
);

const getSliderPosition = () => {
  const maxSliderPosition = target.offsetWidth - slider.offsetWidth;
  const maxLeftPosition = img.offsetWidth - target.offsetWidth;
  const percentage = currentLeft * - 1 / maxLeftPosition;
  return maxSliderPosition * percentage;
}

const setLeft = (value) => {
  currentLeft = value;
  img.style.left = `${currentLeft}px`;
  slider.style.left = `${getSliderPosition()}px`;
};

const setBrightness = (value) => {
  brightness = value;
  img.style.filter = `brightness(${brightness})`;
  brightnessInfo.innerHTML = `${Math.round(brightness * 100)}%`;
};


const changeBrightness = (e) => {
  const clientYs = Object.values(touches).map(({ clientY }) => clientY);
  const currDiff = Math.abs(clientYs[0] - clientYs[1])

  const newValue = !prevYDiff ? brightness : currDiff > prevYDiff ?
    Math.min(brightness + brightnessStep, maxBrightness) :
    Math.max(brightness - brightnessStep, minBrightness);

  setBrightness(newValue);
  prevYDiff = currDiff;
};

const changeLeftPosition = (e) => {
  const touch = touches[e.pointerId];
  setLeft(currentLeft + e.pageX - touch.pageX);
  touches[e.pointerId] = e;
};

const onpointerdown = (e) => {
  touches[e.pointerId] = e;
  target.setPointerCapture(e.pointerId);
}

const onpointermove = (e) => {
  const amount = Object.keys(touches).length;

  if (amount === 1) {
    changeLeftPosition(e);
  }

  if (amount === 2) {
    touches[e.pointerId] = e;
    changeBrightness();
  }
};

const scrollForward = () => {
  if (currentLeft < 0) return;
  const value = currentLeft - 35;
  setLeft(value > 0 ? value : currentLeft - 1);
  requestAnimationFrame(scrollForward);
}

const scrollBack = () => {
  const maxLeft = -1 * (img.offsetWidth - target.offsetWidth);
  if (currentLeft > maxLeft) return;
  const value = currentLeft + 35;
  setLeft(value < maxLeft ? value : currentLeft + 1);
  requestAnimationFrame(scrollBack)
}

const onpointerup = ({ pointerId }) => {
  if (currentLeft > 0) {
    scrollForward();
  } else if (Math.abs(currentLeft) > img.offsetWidth - target.offsetWidth) {
    scrollBack();
  }

  Object.keys(touches).forEach((key) => {
    delete touches[key];
  });
};

target.addEventListener('pointerdown', onpointerdown);
target.addEventListener('pointermove', onpointermove);
target.addEventListener('pointerup', onpointerup);
