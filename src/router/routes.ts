import StartPage from "../pages/StartPage/StartPage";
import Archive from "../pages/Archive/Archive";
import Login from "../pages/Login/Login";
import Account from "./../pages/Account/Account";
import Season from "pages/Season/Season";
import Team from "pages/Team/Team";
import Player from "pages/Player/Player";
import Tournament from "pages/Tournament/Tournament";
import Statistics from "pages/Statistics/Statistics";
import NotFoundPage from "pages/NotFoundPage/NotFoundPage";

export const PublicRoutes = [
  { path: "/archive", Element: Archive },
  { path: "/login", Element: Login },
  { path: "/account", Element: Account },
  { path: "/season/:season/", Element: Season },
  { path: "/team/:team/", Element: Team },
  { path: "/player/:player/", Element: Player },
  { path: "/tour/:tour/", Element: Tournament },
  { path: "/statistics/", Element: Statistics },
  { path: "/", Element: StartPage },
  { path: "*", Element: NotFoundPage },
];
