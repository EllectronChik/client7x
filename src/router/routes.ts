import StartPage from "../pages/StartPage/StartPage";
import Arhive from "../pages/Arhive/Arhive";
import Login from "../pages/Login/Login";
import Account from "./../pages/Account/Account";

export const PublicRoutes = [
  { path: "/arhive", Element: Arhive },
  { path: "/login", Element: Login },
  { path: "/account", Element: Account },
  { path: "/", Element: StartPage },
];
