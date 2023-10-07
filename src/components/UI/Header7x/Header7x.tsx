import React, { useEffect } from 'react'
import classes from './Header7x.module.scss';
import { Link } from 'react-router-dom';
import logo from '@assets/images/favicon.svg';
import Link7x from '../Link7x/Link7x';
import DoubleText from '../DoubleText/DoubleText';
import { useCookies } from 'react-cookie';
import { UsersApi } from 'services/UserService';
import axios from 'axios';
import { useLogoutUser } from 'hooks/useLogoutUser';


const Header7x: React.FC = () => {
  const [cookie, setСookie] = useCookies(['token', 'userId']);
  const [logoutUser, {}] = UsersApi.useLogoutUserMutation();
  const logout = useLogoutUser();

  useEffect(() => {
    if (cookie.token) {
      axios({
        url: `${import.meta.env.VITE_API_URL}is_auth/`,
        method: 'GET',
        headers: {
          Authorization: `Token ${cookie.token}`
        }
      }).catch((error) => {
        logout;
      })
    }
  }, [])

  return (
    <div>
    <header className={classes.header}>
      <div className={classes.container}>
        <Link className={classes.logo_link} to='/'>
          <img className={classes.logo} src={logo} alt="Logo_7x" draggable="false"/>
        </Link>
        <DoubleText className={classes.title} text='Team-League'/>
        <nav>
          <ul className={`${classes.nav} ${cookie.token ? classes.nav_after_log : ''}`}>
            <li className={classes.nav_item}><Link7x to='/statistics'>Statistic</Link7x></li>
            <li className={classes.nav_item}><Link7x to='/arhive'>Arhive</Link7x></li>
            {cookie.token ?
            <li className={classes.nav_item}><Link7x to='/account'>My account</Link7x></li>
            :
            <li className={classes.nav_item}><Link7x to='/login'>Join</Link7x></li>
            }
          </ul>
        </nav>
      </div>
    </header>
    <div className={classes.line}></div>
    </div>
  )
}

export default Header7x;