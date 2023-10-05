import StartPage from '../pages/StartPage';
import Arhive from './../pages/Arhive';
import Login from '../pages/Login/Login';

export const PublicRoutes = [
    {path: '/arhive', Element: Arhive},
    {path: '/login', Element: Login},
    {path: '/', Element: StartPage},
]