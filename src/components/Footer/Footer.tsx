import React from 'react';
import { LOCALES } from 'i18n/locales';
import { useCookies } from 'react-cookie';
import classes from './Footer.module.scss';

interface FooterProps extends React.HTMLProps<HTMLDivElement> {}

const Footer: React.FC<FooterProps> = ({...props}) => {
    const languages = [
        {name: 'English', value: LOCALES.ENGLISH},
        {name: 'Русский', value: LOCALES.RUSSIAN},
        {name: 'Українська', value: LOCALES.UKRAINIAN},
    ]
    const [cookie, setCookie] = useCookies(['locale']);
    let language = LOCALES.ENGLISH;
    const propsClassName = props.className ? `${props.className} ${classes.footer}` : classes.footer;
    if (!cookie?.locale && (window.navigator.language === 'ru' || window.navigator.language === 'ru-RU')) {
        language = LOCALES.RUSSIAN;
    } else if (!cookie?.locale && (window.navigator.language === 'ru-UA' || window.navigator.language === 'uk-UA')) {
        language = LOCALES.UKRAINIAN;
    }
  return (
    <footer className={propsClassName}>
        <select className={classes.select} value={cookie?.locale || language} onChange={(e) => setCookie('locale', e.target.value)}>
            {languages.map((language) => (
                <option className={classes.option} key={language.value} value={language.value}>
                    {language.name}
                </option>
            ))}
        </select>
    </footer>
  )
}

export default Footer