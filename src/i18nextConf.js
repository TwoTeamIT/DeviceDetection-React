import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import translationsIT from "./components/assets/locales/it/translation.json";
import translationEN from "./components/assets/locales/en/translation.json";

const fallbackLng = ["it-IT"];
const availableLanguages = ["en-US", "it-IT"];

const resources = {
  it: {
    translation: translationsIT,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,

    detection: {
      checkWhitelist: true,
    },

    debug: false,

    whitelist: availableLanguages,
  });

export default i18n;
