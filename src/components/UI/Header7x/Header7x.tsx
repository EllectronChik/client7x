import React, { useEffect } from 'react'
import classes from './Header7x.module.scss';
import { Link } from 'react-router-dom';
import logo from '@assets/images/favicon.svg';
import Link7x from '../Link7x/Link7x';
import DoubleText from '../DoubleText/DoubleText';
import { useCookies } from 'react-cookie';
import { UsersApi } from 'services/UserService';
import axios from 'axios';


const Header7x: React.FC = () => {
  const [token, setToken] = useCookies(['token']);
  const [userId, setUserId] = useCookies(['userId']);
  const [logoutUser, {}] = UsersApi.useLogoutUserMutation();

  useEffect(() => {
    if (token.token) {
      axios({
        url: `${import.meta.env.VITE_API_URL}is_auth/`,
        method: 'GET',
        headers: {
          Authorization: `Token ${token.token}`
        }
      }).catch((error) => {
        logout();
      })
    }
  }, [])

  const logout = async () => {
    await logoutUser(token.token);
    setToken('token', '', { expires: new Date(0) });
    setUserId('userId', '', { expires: new Date(0) });
  }

  return (
    <div>
    <header className={classes.header}>
      <div className={classes.container}>
        <Link className={classes.logo_link} to='/'>
          <img className={classes.logo} src={logo} alt="Logo_7x" draggable="false"/>
        </Link>
        <DoubleText className={classes.title} text='Team-League'/>
        <nav>
          <ul className={`${classes.nav} ${token.token ? classes.nav_after_log : ''}`}>
            <li className={classes.nav_item}><Link7x to='/statistics'>Statistic</Link7x></li>
            <li className={classes.nav_item}><Link7x to='/arhive'>Arhive</Link7x></li>
            {token.token ?
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