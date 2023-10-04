import React from 'react'
import classes from './Header7x.module.scss';
import { Link } from 'react-router-dom';
import logo from '@assets/images/favicon.svg';
import Link7x from '../Link7x/Link7x';
import DoubleText from '../DoubleText/DoubleText';


const Header7x = () => {
  return (
    <div>
    <header className={classes.header}>
      <div className={classes.container}>
        <Link className={classes.logo_link} to='/'>
          <img className={classes.logo} src={logo} alt="Logo_7x" draggable="false"/>
        </Link>
        <DoubleText className={classes.title} text='Team-League'/>
        <nav>
          <ul className={classes.nav}>
            <li className={classes.nav_item}><Link7x to='/statistics'>Statistic</Link7x></li>
            <li className={classes.nav_item}><Link7x to='/arhive'>Arhive</Link7x></li>
            <li className={classes.nav_item}><Link7x to='/login'>Join</Link7x></li>
          </ul>
        </nav>
      </div>
    </header>
    <div className={classes.line}></div>
    </div>
  )
}

export default Header7x;