export default {
  // The default namespace of i18next is "translation", but you can customize it here
  defaultNS: "common",
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: "en",
  // Disabling suspense is recommended
  react: { useSuspense: false },
  // This is the list of languages your application supports
  supportedLngs: ["en", "es", "de", "zh", "ja"]
};
