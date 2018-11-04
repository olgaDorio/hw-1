import createCard from './createCard';
import showTouchNodes from './showTouchNodes';
import addTouchListener from './addTouchListener';

class Cards {
  constructor(parent) {
    this.cards = [];
    this.parent = parent;

    this.mount = this.mount.bind(this);
    this.scroll = this.scroll.bind(this);
  }

  mount(array) {
    this.destroy();

    if (!array.length) return;

    this.create(array);

    this.cards.forEach((card) => {
      this.parent.appendChild(card);
    });

    showTouchNodes(this.parent);

    if (!document.querySelector('.image-m')) return;

    addTouchListener({
      imageNode: document.querySelector('.image-m'),
      sliderX: document.querySelector('.image-m__track'),
      brightnessInfo: document.querySelector('.brightness'),
      targetNode: document.querySelector('.image-m__container'),
    });
  }

  scroll(top) {
    this.parent.scroll({
      top,
      left: 0,
      behavior: 'smooth',
    })
  }

  create(array) {
    this.cards = array.map(createCard);
  }

  destroy() {
    this.cards.forEach((card) => {
      card.remove();
    });
  }
}

export default Cards
