const showOnDesktop = document.querySelectorAll('.show-on-desktop');
const showOnMobile = document.querySelectorAll('.show-on-touch');

const isTouchDevice = () => {
  !!(typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      (window.DocumentTouch &&
        typeof document !== 'undefined' &&
        document instanceof window.DocumentTouch))) ||
  !!(typeof navigator !== 'undefined' &&
    (navigator.maxTouchPoints || navigator.msMaxTouchPoints))
}

const showProperImages = () => {
  const isMobile = isTouchDevice();

  showOnDesktop.forEach((node) => {
    node.style.display = isMobile ? 'none' : 'block';
  });

  showOnMobile.forEach((node) => {
    node.style.display = isMobile ? 'block' : 'none';
  })
}

const addTouchListener = ({
  targetNode,
  imageNode,
  sliderX,
  brightnessInfo,
}) => {
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
    const maxSliderPosition = targetNode.offsetWidth - sliderX.offsetWidth;
    const maxLeftPosition = imageNode.offsetWidth - targetNode.offsetWidth;
    const percentage = currentLeft * - 1 / maxLeftPosition;
    return maxSliderPosition * percentage;
  }

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
    targetNode.setPointerCapture(e.pointerId);
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

  const setLeft = (value) => {
    currentLeft = value;
    imageNode.style.left = `${currentLeft}px`;
    sliderX.style.left = `${getSliderPosition()}px`;
  };

  const setBrightness = (value) => {
    brightness = value;
    imageNode.style.filter = `brightness(${brightness})`;
    brightnessInfo.innerHTML = `${Math.round(brightness * 100)}%`;
  };


  const scrollBack = () => {
    const maxLeft = -1 * (imageNode.offsetWidth - targetNode.offsetWidth);
    if (currentLeft > maxLeft) return;
    const value = currentLeft + 35;
    setLeft(value < maxLeft ? value : currentLeft + 1);
    requestAnimationFrame(scrollBack)
  }

  const onpointerup = ({ pointerId }) => {

    if (currentLeft > 0) {
      scrollForward();
    } else if (Math.abs(currentLeft) > imageNode.offsetWidth - targetNode.offsetWidth) {
      scrollBack();
    }

    Object.keys(touches).forEach((key) => {
      delete touches[key];
    });
  };

  targetNode.addEventListener('pointerdown', onpointerdown);
  targetNode.addEventListener('pointermove', onpointermove);
  targetNode.addEventListener('pointerup', onpointerup);
};

addTouchListener({
  targetNode: document.querySelector('.image-m__container'),
  imageNode: document.querySelector('.image-m'),
  sliderX: document.querySelector('.image-m__track'),
  brightnessInfo: document.querySelector('.brightness'),
})

showProperImages()
window.addEventListener('resize', showProperImages);