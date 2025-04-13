import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./en/translation.json"
import translationKO from "./ko/translation.json"

const resources = {
    en: { translation: translationEN },
    ko: { translation: translationKO },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "ko", //기본 설정 언어 - 한국어
    fallbackLng: "en",
    interpolation: {
    escapeValue: false
    }
});

export default i18n;