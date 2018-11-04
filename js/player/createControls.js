export default () => {
  const createSlider = (label, name) => {
    const slider = document.createElement('label');

    slider.innerHTML = `
      ${name.toUpperCase()}
      <div class="slider" data-min="0" data-max="300" data-value="100", data-name=${name}>
        <button class="circle"></button>
      </div>
    `;

    return slider
  }

  const controls = document.createElement('div');
  controls.classList.add('video__controls')

  const button = document.createElement('button');
  button.classList.add('button', 'button--default')
  button.innerHTML = 'Все камеры';

  const chart = document.createElement('div');
  const chartBar = document.createElement('div');
  chart.classList.add('video__chart', 'chart');
  chartBar.classList.add('chart__bar');
  chart.appendChild(chartBar);

  controls.appendChild(button);
  controls.appendChild(createSlider('Яркость', 'brightness'))
  controls.appendChild(createSlider('Контрастность', 'contrast'))
  controls.appendChild(chart);
  return controls;
}
