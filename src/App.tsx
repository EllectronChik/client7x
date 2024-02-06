import "./App.scss";
import AppRouter from "./components/AppRouter/AppRouter";
import { IntlProvider } from "react-intl";
import { LOCALES } from "i18n/locales";
import { MESSAGES } from "i18n/messages";
import { useCookies } from "react-cookie";

function App() {
  const [cookies] = useCookies(["locale"]);
  let language = window.navigator.language;
  if (language === undefined) {
    language = LOCALES.ENGLISH;
  } else if (language === "ru-UA" || language === "uk-UA") {
    language = LOCALES.UKRAINIAN;
  } else if (language === "ru" || language === "ru-RU") {
    language = LOCALES.RUSSIAN;
  } else {
    language = LOCALES.ENGLISH;
  }

  if (cookies.locale) {
    language = cookies.locale;
  }
  return (
    <div className="App">
      <IntlProvider
        messages={MESSAGES[language]}
        locale={language}
        defaultLocale={LOCALES.ENGLISH}
      >
        <AppRouter />
      </IntlProvider>
    </div>
  );
}

export default App;
