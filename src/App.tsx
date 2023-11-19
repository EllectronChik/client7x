import './App.scss';
import AppRouter from './components/AppRouter/AppRouter';
import { IntlProvider } from 'react-intl';
import { LOCALES } from 'i18n/locales';
import { MESSAGES } from 'i18n/messages';
import { useCookies } from 'react-cookie';


function App() {
  const [cookies] = useCookies(['locale']);
  let locale = window.navigator.language || LOCALES.ENGLISH;
  if (cookies.locale) {
    locale = cookies.locale;
  }
  return (
    <div className="App">
      <IntlProvider
        messages={MESSAGES[locale]}
        locale={locale}
        defaultLocale={LOCALES.ENGLISH}>
      <AppRouter />
      </IntlProvider>
    </div>
  );
}

export default App;
