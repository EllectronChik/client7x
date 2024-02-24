import { FC, useEffect } from 'react';
import classes from './NotFoundPage.module.scss';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage component renders a 404 error page when the requested page is not found.
 * It sets the document title to 'Page not found' and provides a link to navigate back to the main page.
 */
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