import React, { useEffect, useState } from 'react';
import classes from './Login.module.scss';
import Button7x from 'components/UI/Button7x/Button7x';
import important_svg from '@assets/images/important.svg';
import { IUserCreate } from 'models/IUserCreate';
import { UsersApi } from 'services/UserService';
import { useCookies } from 'react-cookie';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [token, setToken] = useCookies(['token']);
  const [userId, setUserId] = useCookies(['userId']);

  const [data, setData] = useState<IUserCreate>({
    username: '',
    email: '',
    password: '',
    re_password: ''
  })

  const [createUser,  {}] = UsersApi.useRegisterUserMutation();
  const [loginUser, {}] = UsersApi.useLoginUserMutation();


  useEffect(() => {
    document.title = isLogin ? 'Sign up' : 'Sign in'
  }, [isLogin])

  const verify_registration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createUser(data); 
    verify_login(e);
  }

  const verify_login = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const exp_date = new Date();
      exp_date.setDate(exp_date.getDate() + 21);
      const responce = await loginUser({username: data.username, password: data.password});
      if('data' in responce) {
        setToken('token', responce.data.auth_token, { expires: exp_date });
        setUserId('userId', responce.data.user_id, { expires: exp_date });
        setIsError(null);
      }
      else if (responce.error) {
        if ("status" in responce.error) {
          if (responce.error.status === 400) {
            setIsError("Incorrect username or password");
          }
        }
      }
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.block}>
      <div className={classes.bttns}>
        <button 
          onClick={() => setIsLogin(true)}
          className={`${isLogin ? classes.active : ''} ${classes.btn}`}>SIGN UP</button>
        <button 
          onClick={() => setIsLogin(false)}
          className={`${isLogin ? '' : classes.active} ${classes.btn}`}>SIGN IN</button>
      </div>
      {isLogin 
      ?
        <form className={classes.form} onSubmit={verify_registration}>
          <input type="text" placeholder="Username" onChange={(e) => setData({...data, username: e.target.value})}/>
          <input type="email" placeholder="Email"  onChange={(e) => setData({...data, email: e.target.value})}/>
          <input type="password" placeholder="Password" onChange={(e) => setData({...data, password: e.target.value})}/>
          <input type="text" placeholder='Repeat password' onChange={(e) => setData({...data, re_password: e.target.value})}/>
          <Button7x className={classes.sub_btn} type="submit">Sign up</Button7x>
          <div className={classes.important}>
            <img src={important_svg} className={classes.important_img} alt="important" />
            <p>Important: ONLY the team manager or a member of the administration should register</p>
          </div>
        </form>
        : 
        <form className={classes.form} onSubmit={verify_login}>
          <input type="text" placeholder="Username" onChange={(e) => setData({...data, username: e.target.value})}/>
          <input type="password" placeholder="Password" onChange={(e) => setData({...data, password: e.target.value})}/>
          {isError && <p className={classes.error}>{isError}</p>}
          <Button7x className={classes.sub_btn} type="submit">Sign in</Button7x>
      </form>}
      </div>
    </div>
  )
}

export default Login