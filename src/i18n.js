import i18n from "i18next";
import HttpApi from "i18next-http-backend"
import { initReactI18next } from "react-i18next";

const availableLanguages = [
    "en",
    "ar"
];

const browserLanguage = navigator.language;
let defaultLanguage = browserLanguage.split("-")[0];
if (!availableLanguages.includes(defaultLanguage)) defaultLanguage = "en";
i18n
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: "/i18n/{{lng}}.json"
        },
        lng: defaultLanguage,
        fallbackLng: "en",
        interpolation: { escapeValue: false, },
    });


export default i18n;