import StartPage from "../pages/StartPage/StartPage";
import Archive from "../pages/Archive/Archive";
import Login from "../pages/Login/Login";
import Account from "./../pages/Account/Account";
import Season from "pages/Season/Season";

export const PublicRoutes = [
  { path: "/archive", Element: Archive },
  { path: "/login", Element: Login },
  { path: "/account", Element: Account },
  { path: "/season/:season/", Element: Season },
  { path: "/", Element: StartPage },
];
