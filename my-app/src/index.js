import React from 'react';
import ReactDOM from 'react-dom';

// TODO: remove importants from style

const isMobile = true;

import(`./components/App/App@${isMobile ? 'mobile' : 'desktop'}`)
  .then(({default: App}) => {
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  })
  .catch(console.error);
