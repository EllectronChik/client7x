import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicRoutes } from '../router/routes'
import Header7x from './UI/Header7x/Header7x'

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
        <Header7x />
        <Routes>
          {PublicRoutes.map(route => 
          <Route key={route.path} 
                 path={route.path} 
                 element= {<route.Element />} />
          )}
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouter