import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './en';
import { es } from './es';

const deviceLang = getLocales()[0]?.languageCode === 'en' ? 'en' : 'es';

i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: deviceLang,
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

export default i18n;
