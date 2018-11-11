import React from 'react';

import bitmap from './../../assets/bitmap.jpg';
import bitmap2 from './../../assets/bitmap2.jpg';
import bitmap3 from './../../assets/bitmap3.jpg';

class DesktopImage extends React.Component {
  render() {
    return (
      <img className={this.props.className}
        srcSet={`${bitmap} 820w, ${bitmap2} 1664w, ${bitmap3} 2496w`}
        sizes="(max-width: 900px) 90vw, 30vw"
        src={bitmap3}
        alt=""/>
    )
  }
}

export default DesktopImage;
