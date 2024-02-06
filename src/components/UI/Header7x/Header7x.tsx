import React, { useEffect } from "react";
import classes from "./Header7x.module.scss";
import { Link } from "react-router-dom";
import logo from "@assets/images/techImages/favicon.svg";
import Link7x from "../Link7x/Link7x";
import DoubleText from "../DoubleText/DoubleText";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useLogoutUser } from "hooks/useLogoutUser";
import Button7x from "components/UI/Button7x/Button7x";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Header7x: React.FC = () => {
  const [cookie] = useCookies(["token", "userId"]);
  const logout = useLogoutUser();
  const navigate = useNavigate();
  let timeoutId: NodeJS.Timeout;

  useEffect(() => {
    if (cookie.token) {
      axios({
        url: `${import.meta.env.VITE_API_URL}is_auth/`,
        method: "GET",
        headers: {
          Authorization: `Token ${cookie.token}`,
        },
      }).catch(() => {
        logout();
      });
    }
  }, []);

  return (
    <div>
      <header className={classes.header}>
        <div className={classes.container}>
          <Link className={classes.logo_link} to="/">
            <img
              className={classes.logo}
              src={logo}
              alt="Logo_7x"
              draggable="false"
            />
          </Link>
          <DoubleText className={classes.title} text="Team-League" />
          <nav>
            <ul
              className={`${classes.nav} ${
                cookie.token ? classes.nav_after_log : ""
              }`}
            >
              <li className={classes.nav_item}>
                <Link7x to="/statistics">
                  <FormattedMessage id="statistic" />
                </Link7x>
              </li>
              <li className={classes.nav_item}>
                <Link7x to="/arhive">
                  <FormattedMessage id="archive" />
                </Link7x>
              </li>
              {cookie.token ? (
                <div
                  onMouseEnter={() => {
                    if (timeoutId) {
                      clearTimeout(timeoutId);
                    }
                    const logout = document.getElementById("logout");
                    logout?.classList.add(classes.active);
                  }}
                  onMouseLeave={() => {
                    const logout = document.getElementById("logout");
                    timeoutId = setTimeout(() => {
                      logout?.classList.remove(classes.active);
                    }, 500);
                  }}
                  className={classes.nav_item}
                >
                  <li>
                    <Link7x to="/account">
                      <FormattedMessage id="myAccount" />
                    </Link7x>
                  </li>
                  <li
                    onMouseEnter={() => {
                      if (timeoutId) {
                        clearTimeout(timeoutId);
                      }
                    }}
                    onMouseLeave={() => {
                      const logout = document.getElementById("logout");
                      timeoutId = setTimeout(() => {
                        logout?.classList.remove(classes.active);
                      }, 500);
                    }}
                    className={classes.logout}
                    id="logout"
                  >
                    <Button7x
                      className={classes.logout_btn}
                      type="button"
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                    >
                      <FormattedMessage id="logout" />
                    </Button7x>
                  </li>
                </div>
              ) : (
                <li className={classes.nav_item}>
                  <Link7x to="/login">
                    <FormattedMessage id="login" />
                  </Link7x>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <div className={classes.line}></div>
    </div>
  );
};

export default Header7x;
