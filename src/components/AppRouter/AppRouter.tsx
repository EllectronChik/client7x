import { FC, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicRoutes } from "../../router/routes";
import Header7x from "../UI/Header7x/Header7x";
import Footer from "../Footer/Footer";
import classes from "./AppRouter.module.scss";

/**
 * Main application router component.
 * Responsible for handling routing and rendering of public routes.
 */
const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      {/* Application container */}
      <div className={classes.appContainer}>
        {/* Header component */}
        <Header7x />

        {/* Router configuration */}
        <Routes>
          {/* Mapping through public routes */}
          {PublicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<Suspense><route.Element /></Suspense>}
            />
          ))}
        </Routes>

        {/* Footer component */}
        <Footer className={classes.footer} />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
