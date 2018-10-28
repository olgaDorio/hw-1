import createCard from './create-card';
import addTouchListener from './add-touch-listener';
import showTouchNodes from './show-touch-nodes';

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

const root = document.querySelector('.page') as HTMLElement;
const main = document.querySelector('.page__main') as HTMLElement;

fetch('https://agile-plains-47360.herokuapp.com/api/events')
// fetch('http://localhost:8000/api/events')
  .then(r => r.json())
  .then(({ array }) => {
    array.forEach((item: EventInterface) => {
      const node = createCard(item) as HTMLElement;
      main.appendChild(node);
    });

    showTouchNodes(root as HTMLElement);

    addTouchListener({
      imageNode: document.querySelector('.image-m') as HTMLElement,
      sliderX: document.querySelector('.image-m__track') as HTMLElement,
      brightnessInfo: document.querySelector('.brightness') as HTMLElement,
      targetNode: document.querySelector('.image-m__container') as HTMLElement,
    });
  })
  .catch(console.log);
