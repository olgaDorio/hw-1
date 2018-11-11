import React from "react";
import richdata from './../../assets/Richdata.svg';

class Graph extends React.Component {
  render() {
    return <img src={richdata} alt="" className={this.props.className}/>
  }
}

export default Graph;
