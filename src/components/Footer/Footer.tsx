import { FC, HTMLProps } from "react";
import { LOCALES } from "i18n/locales"; // Importing locales for internationalization
import { useCookies } from "react-cookie"; // Importing hook for managing cookies
import classes from "./Footer.module.scss"; // Importing SCSS module for styling
import blizzardLogo from "assets/images/campaignsLogos/Blizzard.webp"; // Importing Blizzard logo image
import { FormattedMessage } from "react-intl"; // Importing component for internationalized messages

/**
 * Footer component
 *
 * This component represents the footer section of the application.
 * It provides language selection, copyright information, and links to external resources.
 *
 * @param props - HTMLProps<HTMLDivElement> props for the footer div element
 */
const Footer: FC<HTMLProps<HTMLDivElement>> = ({ ...props }) => {
  const [cookie, setCookie] = useCookies(["locale"]); // Using cookies for managing language preference

  let language = LOCALES.ENGLISH; // Default language is English
  const propsClassName = props.className
    ? `${props.className} ${classes.footer}`
    : classes.footer; // Merging additional class names with footer classes

  // Detect user's preferred language from browser settings if not already set
  if (!cookie.locale) {
    Array.from(Object.keys(LOCALES)).forEach((key) => {
      if (
        LOCALES[key].value.split("-")[0].indexOf(window.navigator.language) !==
        -1
      ) {
        language = LOCALES[key];
      }
    });
  }

  return (
    <footer className={propsClassName}>
      <div className={classes.line}></div> {/* Divider line */}
      <div className={classes.container}>
        {/* Language selection */}
        <div className={classes.language}>
          <h3>
            <FormattedMessage id="language" />:
          </h3>
          <select
            className={classes.select}
            value={cookie?.locale || language.value}
            onChange={(e) =>
              setCookie("locale", e.target.value, {
                expires: new Date(
                  new Date().getTime() + 1000 * 60 * 60 * 24 * 365
                ),
              })
            }
          >
            {Array.from(Object.values(LOCALES)).map((language) => (
              <option
                className={classes.option}
                key={language.value}
                value={language.value}
              >
                {language.name}
              </option>
            ))}
          </select>
        </div>
        {/* Copyright information */}
        <div>
          <p>&copy;2002-{new Date().getFullYear()} 7x.ru sc2 Team</p>
        </div>
        {/* Ownership information */}
        <div className={classes.copyright}>
          <div className={classes.copyrightText}>
            <p>
              <FormattedMessage id="starcraftTrademark" />
            </p>
            <p>
              <FormattedMessage id="bitmapOwnership" />
            </p>
            <p>
              <FormattedMessage id="blizzardOwnership" />{" "}
              <a
                target="_blank"
                className={classes.link}
                href="https://www.blizzard.com"
              >
                Blizzard Entertainment
              </a>
              .
            </p>
          </div>
          {/* Blizzard logo */}
          <div>
            <a target="_blank" href="https://www.blizzard.com">
              <img className={classes.logo} src={blizzardLogo} alt="Blizzard" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; // Exporting Footer component
