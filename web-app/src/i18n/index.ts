import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import de from "./translations/de";
import en from "./translations/en";

const storedLang = localStorage.getItem("i18nextLng");

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "de",
		lng: storedLang || "de",
		resources: {
			de,
			en,
		},
	});

export default i18n;
