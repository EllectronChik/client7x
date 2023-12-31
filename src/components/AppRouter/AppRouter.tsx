import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicRoutes } from '../../router/routes'
import Header7x from '../UI/Header7x/Header7x'
import Footer from '../Footer/Footer'
import classes from './AppRouter.module.scss'

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <div className={classes.app_container}>
          <Header7x />
          <Routes>
            {PublicRoutes.map(route => 
            <Route key={route.path} 
                  path={route.path} 
                  element= {<route.Element />} />
            )}
          </Routes>
        <Footer className={classes.footer} />
      </div>
    </BrowserRouter>
  )
}

export default AppRouter