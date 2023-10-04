import React from 'react'
import classes from './Header7x.module.scss';
import { Link } from 'react-router-dom';
import logo from '@assets/images/favicon.svg';


const Header7x = () => {
  return (
    <header className={classes.header}>
      <span className={classes.left_border}></span>
      <div className={classes.container}>
        <Link className={classes.logo_link} to='/'>
          <img className={classes.logo} src={logo} alt="Logo_7x" />
        </Link>
        <nav>
          <ul className={classes.nav}>
            <li className={classes.nav_item}><Link to='/arhive'>Arhive</Link></li>
            <li className={classes.nav_item}><Link to='/settings'>Settings</Link></li>
          </ul>
        </nav>
      </div>
      <span className={classes.right_border}></span>
      <span className={classes.bottom_border}></span>
    </header>
  )
}

export default Header7x;