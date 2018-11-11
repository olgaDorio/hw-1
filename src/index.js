import React from 'react';
import ReactDOM from 'react-dom';
import MobileDetect from 'mobile-detect';

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = !!md.mobile();

import(`./components/App/App@${isMobile ? 'mobile' : 'desktop'}`)
  .then(({default: App}) => {
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  })
  .catch(console.error);
