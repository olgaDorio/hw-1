const root = document.querySelector('.page');
const main = document.querySelector('.page__main');

fetch('https://agile-plains-47360.herokuapp.com/api/events')
  .then(r => r.json())
  .then(({ array }) => {
    const cards = array.map(createCard);

    cards.forEach((card) => {
      main.appendChild(card);
    });

    showTouchNodes(root);

    addTouchListener({
      imageNode: document.querySelector('.image-m'),
      sliderX: document.querySelector('.image-m__track'),
      brightnessInfo: document.querySelector('.brightness'),
      targetNode: document.querySelector('.image-m__container'),
    });
  })
  .catch(console.log);
