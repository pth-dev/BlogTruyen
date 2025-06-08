import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enManga from './locales/en/manga.json';
import enReader from './locales/en/reader.json';
import viCommon from './locales/vi/common.json';
import viManga from './locales/vi/manga.json';
import viReader from './locales/vi/reader.json';

const resources = {
  en: {
    common: enCommon,
    manga: enManga,
    reader: enReader,
  },
  vi: {
    common: viCommon,
    manga: viManga,
    reader: viReader,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'manga', 'reader'],
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
