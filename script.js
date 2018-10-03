const cardTemplate = document.getElementById('card').content.querySelector('.card');
const buttonTemplate = document.getElementById('buttons').content.querySelector('.button__group');
const indicatorsTemplate = document.getElementById('indicators').content.querySelector('.indicators');
const imageTemplate = document.getElementById('image').content.querySelector('.card__image');
const playerTemplate = document.getElementById('player').content.querySelector('.player');

const getButtonWrapper = (actions) => {
  const node = buttonTemplate.cloneNode(true);
  const buttons = node.querySelectorAll('button');
  actions.forEach((action, index) => {
    if (!buttons[index]) return;
    buttons[index].innerHTML = action;
  });
  return node;
}

const getIndicatorsWrapper = ({ temperature, humidity }) => {
  const node = indicatorsTemplate.cloneNode(true);
  const values = node.querySelectorAll('.value');
  values[0].innerHTML = `${temperature} C`;
  values[1].innerHTML = `${humidity}%`;
  return node
}

const getImageWrapper = (src) => {
  const node = imageTemplate.cloneNode(true);
  node.src = src;
  return node;
}

const getPlayerWrapper = ({ albumcover, artist, track, volume }) => {
  const node = playerTemplate.cloneNode(true);
  node.querySelector('.player__albumcover').src = albumcover;
  return node;
}

const displayEvent = ({ description, icon, size, source, time, title, type, data } = {}) => {
  const node = cardTemplate.cloneNode(true);
  const _title = node.querySelector('.card__title')
  const _source = node.querySelector('.card__source')
  const _time = node.querySelector('.card__time')
  const _description = node.querySelector('.card__description')
  const _body = node.querySelector('.card__body');

  _title.querySelector('span').innerHTML = title;
  _title.querySelector('use').href.animVal = `#${icon}`;
  _title.querySelector('use').href.baseVal = `#${icon}`;
  _title.querySelector('svg').classList.add(`icon--${icon}`);

  _source.innerHTML = source;
  _time.innerHTML = time;
  _description.innerHTML = description;

  if (data && data.type === 'graph') {
    _body.appendChild(getImageWrapper('chart.png'));
  } else if (data && data.image) {
    _body.appendChild(getImageWrapper('bitmap.png'));
  } else if (data && Object.keys(data).every(k => ['temperature', 'humidity'].includes(k))) {
    _body.appendChild(getIndicatorsWrapper(data))
  } else if (data && data.buttons) {
    _body.appendChild(getButtonWrapper(data.buttons))
  } else if (data && data.albumcover) {
    _body.appendChild(getPlayerWrapper(data));
  } else if (data) {
    const b = document.createElement('b');
    b.innerHTML = JSON.stringify(data)
    _body.appendChild(b)
  }

  if (!description) {
    _description.remove()
  }

  if (!description && !data) {
    node.querySelector('.card__body').remove();
  }

  node.classList.add(`card--${type}`)
  node.classList.add(`card--${size}`)

  document.querySelector('.main').appendChild(node);
}

fetch('/events.json')
  .then(response => response.json())
  .then(({events}) => {
    // console.log(events)
    console.log(events.map(e => e.icon))
    events.forEach((event) => {
      displayEvent(event);
    })
  })
  .catch(console.error)

// displayEvent()
