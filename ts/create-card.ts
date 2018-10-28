interface EventInterface {
  size?: string;
  description: string;
  data: EventData;
  icon?: string;
  title: string;
  source: string;
  time: string;
  type?: string;
}

interface EventData {
  volume: string;
  albumcover: string;
  artist: string;
  track: {
    length: string,
  };
  temperature: Number;
  humidity: Number;
  buttons?: [string, string];
  type?: string;
  image?: string;
}

const cardTemplate = document.getElementById('card');
const bodyTemplate = document.getElementById('body');
const graphTemplate = document.getElementById('graph');
const imageTemplate = document.getElementById('image');
const playerTemplate = document.getElementById('player');
const buttonsTemplate = document.getElementById('buttons');
const indicatorTemplate = document.getElementById('indicator');

const cardContent: DocumentFragment = (<HTMLTemplateElement>cardTemplate).content;
const bodyContent: DocumentFragment = (<HTMLTemplateElement>bodyTemplate).content;
const graphContent: DocumentFragment = (<HTMLTemplateElement>graphTemplate).content;
const imageContent: DocumentFragment = (<HTMLTemplateElement>imageTemplate).content;
const playerContent: DocumentFragment = (<HTMLTemplateElement>playerTemplate).content;
const buttonsContent: DocumentFragment = (<HTMLTemplateElement>buttonsTemplate).content;
const indicatorContent: DocumentFragment = (<HTMLTemplateElement>indicatorTemplate).content;

const createButtons = ([first, second]: [string, string]) => {
  const clone = buttonsContent.cloneNode(true);
  const node = (<HTMLElement>clone).querySelector('.button__group');
  if (!node) return null;
  if (node.children[0]) node.children[0].innerHTML = first;
  if (node.children[1]) node.children[1].innerHTML = second;
  return node;
};

const createGraph = () => {
  const clone = graphContent.cloneNode(true);
  const node = (<HTMLElement>clone).querySelector('img');
  if (!node) return null;
  node.src = 'assets/Richdata.svg';
  return node;
};

const createImages = () => {
  const clone = imageContent.cloneNode(true);
  const node = <HTMLElement>clone;

  node.querySelectorAll('img').forEach((img) => {
    img.srcset = 'assets/bitmap.jpg 820w, assets/bitmap2.jpg 1664w, assets/bitmap3.jpg 2496w';
    img.sizes = '(max-width: 900px) 90vw, 30vw';
    img.src = 'assets/bitmap3.jpg';
  });

  return node;
};

const createIndicator = ({ temperature, humidity }: EventData) => {
  const clone = indicatorContent.cloneNode(true);
  const node = (<HTMLElement>clone).querySelector('.indicator__group');
  if (!node) return null;
  const values = node.querySelectorAll('.indicator__value');
  values[0].innerHTML = `${temperature} C`;
  values[1].innerHTML = `${humidity}%`;
  return node;
};

const createPlayer = (data: EventData) => {
  const node = playerContent.querySelector('.player');
  if (!node) return;
  const input = node.querySelector('.range--round') as HTMLInputElement;
  const image = node.querySelector('.player__albumcover') as HTMLImageElement;

  input.value = data.volume;
  image.src = data.albumcover;

  const playerArtist = node.querySelector('.player__artist');
  const playerVolume = node.querySelector('.player__volume');
  const playerDuration = node.querySelector('.player__duration');

  if (playerArtist) playerArtist.innerHTML = data.artist;
  if (playerVolume) playerVolume.innerHTML = data.volume;
  if (playerDuration) playerDuration.innerHTML = data.track.length;

  return node;
};

export default (event: EventInterface) => {
  const {
    size, description, data, icon, title, source, time,
  } = event;

  const cardClone = cardContent.cloneNode(true);
  const card = (<HTMLElement>cardClone).querySelector('.card');

  if (!card) return;

  card.classList.add(`card--${size}`, `card--${event.type}`);

  if (!description && !data) {
    card.classList.add('card--small');
  }

  const cardImage = card.querySelector('img');
  const cardTitle = card.querySelector('span');
  const cardSubtitle = card.querySelector('.card__subtitle');

  if (cardImage) cardImage.src = `assets/${icon}.svg`;

  if (cardTitle) {
    cardTitle.title = title;
    cardTitle.innerHTML = title;
  }

  if (cardSubtitle && cardSubtitle.children.length > 1) {
    cardSubtitle.children[0].innerHTML = source;
    cardSubtitle.children[1].innerHTML = time;
  }

  if (!description && !data) {
    return card;
  }

  const bodyClone = bodyContent.cloneNode(true);
  const cardBody = (<HTMLElement>bodyClone).querySelector('.card__body');

  if (!cardBody) return;

  const cardDescription = cardBody.querySelector('.card__description');
  if (cardDescription) cardDescription.innerHTML = description;
  card.appendChild(cardBody);

  const {
    buttons, type, image, albumcover,
  }: EventData = event.data || {};

  if (buttons) {
    cardBody.appendChild(createButtons(buttons) as Node);
  } else if (type === 'graph') {
    cardBody.appendChild(createGraph() as Node);
  } else if (image) {
    cardBody.appendChild(createImages());
  } else if (event.data && ['temperature', 'humidity'].every(k => event.data.hasOwnProperty(k))) {
    cardBody.appendChild(createIndicator(event.data) as Node);
  } else if (albumcover) {
    cardBody.appendChild(createPlayer(event.data) as Node);
  }

  return card;
};
