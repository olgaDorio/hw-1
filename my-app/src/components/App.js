import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import './../css/common.css'
import logo from './../assets/logo.png';

import Events from './Events';
import Monitoring from './Monitoring';

const AppRouter = () => (
  <Router>
    <div className="page">
      <header className="page__header">
        <img src={logo} alt="" className="icon icon--logo"/>

        <NavLink activeClassName='link--active' to="/events" className="link">События</NavLink>
        <NavLink activeClassName='link--active' to="/monitoring" className="link">Видеонаблюдение</NavLink>
        <div className="link">Сводка</div>
        <div className="link">Устройства</div>
        <div className="link">Сценарии</div>

      </header>

      <Route path="/events" exact component={Events} />
      <Route path="/monitoring" component={Monitoring} />
    </div>

  </Router>
);

export default AppRouter;
