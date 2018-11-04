export default (links = []) => {
  if (links.length !== 4) return;

  const container = document.createElement('div');
  container.classList.add('video__container');

  links.forEach((link) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('video__wrapper');
    wrapper.innerHTML = `
      <video class="video" autoplay muted loop src=${link}></video>
    `
    container.appendChild(wrapper);
  })

  return container;
};
