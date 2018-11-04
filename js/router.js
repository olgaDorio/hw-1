export default (store) => {
  document.querySelectorAll('header .link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = e.target.pathname;
      if (route) store.dispatch('setRoute', route);
    })
  })
};
