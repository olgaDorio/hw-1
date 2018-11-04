export default ({
  targetNode,
  imageNode,
  sliderX,
  brightnessInfo,
}) => {
  const touches = {};

  const minBrightness = 0.3;
  const maxBrightness = 1;
  const brightnessStep = 0.05;
  const scrollSpeed = 25;

  let currentLeft = 0;
  let brightness = 1;

  let prevYDiff = null;

  const getSliderPosition = () => {
    const maxSliderPosition = targetNode.offsetWidth - sliderX.offsetWidth;
    const maxLeftPosition = imageNode.offsetWidth - targetNode.offsetWidth;
    const percentage = currentLeft * -1 / maxLeftPosition;
    return maxSliderPosition * percentage;
  };

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

  const changeBrightness = () => {
    const clientYs = Object.values(touches).map(({ clientY }) => clientY);
    const currDiff = Math.abs(clientYs[0] - clientYs[1]);

    let newValue;

    if (!prevYDiff) {
      newValue = brightness;
    } else if (currDiff > prevYDiff) {
      newValue = Math.min(brightness + brightnessStep, maxBrightness);
    } else {
      newValue = Math.max(brightness - brightnessStep, minBrightness);
    }

    setBrightness(newValue);
    prevYDiff = currDiff;
  };

  const changeLeftPosition = (e) => {
    const touch = touches[e.pointerId];
    setLeft(currentLeft + e.pageX - touch.pageX);
    touches[e.pointerId] = e;
  };

  const scrollForward = () => {
    if (currentLeft < 0) return;
    const value = currentLeft - scrollSpeed;
    setLeft(value > 0 ? value : currentLeft - 1);
    requestAnimationFrame(scrollForward);
  };

  const scrollBack = () => {
    const maxLeft = -1 * (imageNode.offsetWidth - targetNode.offsetWidth);
    if (currentLeft > maxLeft) return;
    const value = currentLeft + scrollSpeed;
    setLeft(value < maxLeft ? value : currentLeft + 1);
    requestAnimationFrame(scrollBack);
  };


  const onpointerdown = (e) => {
    touches[e.pointerId] = e;
    targetNode.setPointerCapture(e.pointerId);
  };

  const onpointermove = (e) => {
    const amount = Object.keys(touches).length;

    if (amount === 1) {
      changeLeftPosition(e);
    } else if (amount === 2) {
      touches[e.pointerId] = e;
      changeBrightness();
    }
  };

  const onpointerup = () => {
    if (currentLeft > 0) {
      scrollForward();
    } else if (Math.abs(currentLeft) > imageNode.offsetWidth - targetNode.offsetWidth) {
      scrollBack();
    }

    Object.keys(touches).forEach((key) => {
      delete touches[key];
    });
  };

  if (!targetNode || !imageNode || !sliderX || !brightnessInfo) return;

  targetNode.addEventListener('pointerup', onpointerup);
  targetNode.addEventListener('pointercancel', onpointerup);
  targetNode.addEventListener('pointerdown', onpointerdown);
  targetNode.addEventListener('pointermove', onpointermove);
};
