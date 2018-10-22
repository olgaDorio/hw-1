const cardTemplate = document.getElementById('card').content;
const bodyTemplate = document.getElementById('body').content;
const graphTemplate = document.getElementById('graph').content;
const imageTemplate = document.getElementById('image').content;
const playerTemplate = document.getElementById('player').content;
const buttonsTemplate = document.getElementById('buttons').content;
const indicatorTemplate = document.getElementById('indicator').content;

const createButtons = ([first, second]) => {
  const node = buttonsTemplate.cloneNode(true).querySelector('.button__group');
  node.children[0].innerHTML = first;
  node.children[1].innerHTML = second;
  return node;
};

const createGraph = () => {
  const node = graphTemplate.cloneNode(true).querySelector('img');
  node.src = 'assets/Richdata.svg';
  return node;
};

const createImages = () => {
  const node = imageTemplate.cloneNode(true);

  node.querySelectorAll('img').forEach((img) => {
    img.srcset = 'assets/bitmap.jpg 820w, assets/bitmap2.jpg 1664w, assets/bitmap3.jpg 2496w';
    img.sizes = '(max-width: 900px) 90vw, 30vw';
    img.src = 'assets/bitmap3.jpg';
  });

  return node;
};

const createIndicator = ({ temperature, humidity }) => {
  const node = indicatorTemplate.cloneNode(true).querySelector('.indicator__group');
  const values = node.querySelectorAll('.indicator__value');
  values[0].innerHTML = `${temperature} C`;
  values[1].innerHTML = `${humidity}%`;
  return node;
};

const createPlayer = (data) => {
  const node = playerTemplate.querySelector('.player');
  node.querySelector('.range--round').value = data.volume;
  node.querySelector('.player__artist').innerHTML = data.artist;
  node.querySelector('.player__volume').innerHTML = data.volume;
  node.querySelector('.player__albumcover').src = data.albumcover;
  node.querySelector('.player__duration').innerHTML = data.track.length;
  return node;
};

const createCard = (event) => {
  const {
    size, description, data, icon, title, source, time,
  } = event;

  const card = cardTemplate.cloneNode(true).querySelector('.card');

  card.classList.add(`card--${size}`, `card--${event.type}`);
  if (!description && !data) {
    card.classList.add('card--small');
  }

  card.querySelector('img').src = `assets/${icon}.svg`;
  card.querySelector('span').title = title;
  card.querySelector('span').innerHTML = title;
  card.querySelector('.card__subtitle').children[0].innerHTML = source;
  card.querySelector('.card__subtitle').children[1].innerHTML = time;

  if (!description && !data) {
    return card;
  }

  const cardBody = bodyTemplate.cloneNode(true).querySelector('.card__body');
  cardBody.querySelector('.card__description').innerHTML = description;
  card.appendChild(cardBody);

  const {
    buttons, type, image, albumcover,
  } = event.data || {};

  if (buttons) {
    cardBody.appendChild(createButtons(buttons));
  } else if (type === 'graph') {
    cardBody.appendChild(createGraph());
  } else if (image) {
    cardBody.appendChild(createImages());
  } else if (event.data && ['temperature', 'humidity'].every(key => event.data.hasOwnProperty(key))) {
    cardBody.appendChild(createIndicator(event.data));
  } else if (albumcover) {
    cardBody.appendChild(createPlayer(event.data));
  }

  return card;
};
