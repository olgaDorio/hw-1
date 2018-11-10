import React from "react";
import { cn, classnames } from '@bem-react/classname';
import { BrowserRouter as Router, Route, NavLink, Redirect } from "react-router-dom";

import './page.css';
import './title.css';
import './common.css';
import './link.css';

import Icon from './../Icon/Icon';
import Events from './../Pages/Events';
import Monitoring from './../Pages/Monitoring';

const cnPage = cn('Page');
const cnLink = cn('Link');

const AppRouter = () => (
  <Router>
    <div className={cnPage()}>
      <header className={cnPage('Header')}>
        <Icon name="logo" logo={true}></Icon>
        <NavLink activeClassName={cnLink({active: true})} to="/events" className={cnLink()}>События</NavLink>
        <NavLink activeClassName={cnLink({active: true})} to="/monitoring" className={cnLink()}>Видеонаблюдение</NavLink>
        <div className={cnLink()}>Сводка</div>
        <div className={cnLink()}>Устройства</div>
        <div className={cnLink()}>Сценарии</div>
      </header>

      <Redirect from="/" to="events" />
      <Route name="events" path="/events" render={props => <Events routeClassName={cnPage('Main')}/>}/>
      <Route name="monitoring" path="/monitoring" render={props => <Monitoring routeClassName={classnames(cnPage('Main'), cnPage('Player'))}/>} />

      <footer className={cnPage('Footer')}>
        <div className={cnLink({small: true})}>Помощь</div>
        <div className={cnLink({small: true})}>Обратная связь</div>
        <div className={cnLink({small: true})}>Разработчикам</div>
        <div className={cnLink({small: true})}>Условия использования</div>
        <a
          className={cnLink({small: true, separate: true})}
          href="https://wiki.yandex.ru/shri-2018-II/homework/Adaptivnaja-vjorstka/.files/license.pdf"
          rel="noopener noreferrer"
          target="_blank">
          © 2001–2017  ООО «Яндекс»
        </a>
      </footer>
    </div>

  </Router>
);

export default AppRouter;
