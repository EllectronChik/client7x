import "./App.scss";
import AppRouter from "./components/AppRouter/AppRouter";
import { IntlProvider } from "react-intl";
import { LOCALES } from "i18n/locales";
import { MESSAGES } from "i18n/messages";
import { useCookies } from "react-cookie";

function App() {
  const [cookies] = useCookies(["locale"]);
  let language = window.navigator.language;

  if (cookies.locale) {
    language = cookies.locale;
  } else {
    Array.from(Object.keys(LOCALES)).forEach((key) => {
      if (LOCALES[key].value.split("-")[0].indexOf(language) !== -1) {
        language = LOCALES[key].value;
      }
    });
  }
  if (!MESSAGES[language]) {
    language = LOCALES.ENGLISH.value;
  }
  return (
    <div className="App">
      <IntlProvider
        messages={MESSAGES[language]}
        locale={language}
        defaultLocale={LOCALES.ENGLISH.value}
      >
        <AppRouter />
      </IntlProvider>
    </div>
  );
}

export default App;
