import { FC, useEffect } from 'react';
import classes from './NotFoundPage.module.scss';
import { Link } from 'react-router-dom';

const NotFoundPage: FC = () => {

  useEffect(() => {
    document.title = 'Page not found';
  }, []);

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>404</h1>
      <h2 className={classes.subtitle}>Page not found</h2>
      <h3 className={classes.sectitle}>Navigate to <br /><Link className={classes.link} to='/'>The Main Page</Link></h3>
    </div>
  )
}

export default NotFoundPage