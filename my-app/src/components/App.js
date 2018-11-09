import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import './../css/page.css';
import './../css/title.css';
import './../css/common.css'

import './../css/link.css';

import './../css/card.css';
import './../css/indicator.css';

// на сладкое, тут самое мясо
import './../css/image.css';

import Events from './Events';
import Monitoring from './Monitoring';

import { cn, classnames } from '@bem-react/classname';
import Icon from './Icon.js';

const pageCn = cn('Page');
const linkCn = cn('Link');


const AppRouter = () => (
  <Router>
    <div className={pageCn()}>
      <header className={pageCn('Header')}>
        <Icon name="logo" logo={true}></Icon>

        <NavLink activeClassName={linkCn({active: true})} to="/events" className={linkCn()}>События</NavLink>
        <NavLink activeClassName={linkCn({active: true})} to="/monitoring" className={linkCn()}>Видеонаблюдение</NavLink>
        <div className={linkCn()}>Сводка</div>
        <div className={linkCn()}>Устройства</div>
        <div className={linkCn()}>Сценарии</div>

      </header>



      <Route path="/events" render={props => <Events routeClassName={pageCn('Main')}/>}/>
      <Route path="/monitoring" render={props => <Monitoring routeClassName={classnames(pageCn('Main'), pageCn('Player'))}/>} />

      <footer className={pageCn('Footer')}>
        <a className={linkCn({small: true})} href="#">Помощь</a>
        <a className={linkCn({small: true})} href="#">Обратная связь</a>
        <a className={linkCn({small: true})} href="#">Разработчикам</a>
        <a className={linkCn({small: true})} href="#">Условия использования</a>
        <a className={linkCn({small: true, separate: true})} href="https://wiki.yandex.ru/shri-2018-II/homework/Adaptivnaja-vjorstka/.files/license.pdf" target="_blank">© 2001–2017  ООО «Яндекс»</a>
      </footer>
    </div>

  </Router>
);

export default AppRouter;
