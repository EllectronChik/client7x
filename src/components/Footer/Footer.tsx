import { FC, HTMLProps } from "react";
import { LOCALES } from "i18n/locales";
import { useCookies } from "react-cookie";
import classes from "./Footer.module.scss";
import blizzardLogo from "assets/images/campaignsLogos/Blizzard.webp";
import { FormattedMessage } from "react-intl";

const Footer: FC<HTMLProps<HTMLDivElement>> = ({ ...props }) => {
  const languages = [
    { name: "English", value: LOCALES.ENGLISH },
    { name: "Русский", value: LOCALES.RUSSIAN },
    { name: "Українська", value: LOCALES.UKRAINIAN },
  ];
  const [cookie, setCookie] = useCookies(["locale"]);

  const russianLanguageCodes = [
    "ru",
    "ru-RU",
    "ru-UA",
    "ru-BY",
    "ru-KZ",
    "ru-KG",
    "ru-MD",
  ];
  const ukrainianLanguageCodes = ["uk", "uk-UA"];

  let language = LOCALES.ENGLISH;
  const propsClassName = props.className
    ? `${props.className} ${classes.footer}`
    : classes.footer;
  if (
    !cookie?.locale &&
    russianLanguageCodes.includes(window.navigator.language)
  ) {
    language = LOCALES.RUSSIAN;
  } else if (
    !cookie?.locale &&
    ukrainianLanguageCodes.includes(window.navigator.language)
  ) {
    language = LOCALES.UKRAINIAN;
  }
  return (
    <footer className={propsClassName}>
      <div className={classes.line}></div>
      <div className={classes.container}>
        <div className={classes.language}>
          <h3>
            <FormattedMessage id="language" />:
          </h3>
          <select
            className={classes.select}
            value={cookie?.locale || language}
            onChange={(e) =>
              setCookie("locale", e.target.value, {
                expires: new Date(
                  new Date().getTime() + 1000 * 60 * 60 * 24 * 365
                ),
              })
            }
          >
            {languages.map((language) => (
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
        <div>
          <p>&copy;2002-{new Date().getFullYear()} 7x.ru sc2 Team</p>
        </div>
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

export default Footer;
