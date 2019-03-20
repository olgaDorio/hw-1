const isTouchDevice = () => (
  !!navigator.maxTouchPoints && 'ontouchstart' in window
);

export default (root: HTMLElement) => {
  const showOnDesktop = document.querySelectorAll('.show-on-desktop');
  const showOnMobile = document.querySelectorAll('.show-on-touch');

  const isMobile = isTouchDevice();
  root.classList[isMobile ? 'add' : 'remove']('no-hover');

  showOnDesktop.forEach((node) => {
    node.classList[isMobile ? 'add' : 'remove']('hidden');
  });

  showOnMobile.forEach((node) => {
    node.classList[isMobile ? 'remove' : 'add']('hidden');
  });
};
