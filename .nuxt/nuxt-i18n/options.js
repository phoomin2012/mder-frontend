

export const Constants = {
  COMPONENT_OPTIONS_KEY: "nuxtI18n",
  STRATEGIES: {"PREFIX":"prefix","PREFIX_EXCEPT_DEFAULT":"prefix_except_default","PREFIX_AND_DEFAULT":"prefix_and_default","NO_PREFIX":"no_prefix"},
}
export const nuxtOptions = {
  isUniversalMode: false,
  trailingSlash: undefined,
}
export const options = {
  vueI18n: {},
  vueI18nLoader: false,
  locales: [{"icon":"th","code":"th","file":"th.json"},{"icon":"en","code":"en","file":"en.json"}],
  defaultLocale: "th",
  defaultDirection: "ltr",
  routesNameSeparator: "___",
  defaultLocaleRouteNameSuffix: "default",
  strategy: "no_prefix",
  lazy: true,
  langDir: "/Users/phumin/Desktop/mder-frontend/lang",
  rootRedirect: null,
  detectBrowserLanguage: {"alwaysRedirect":false,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n_redirected","cookieSecure":false,"fallbackLocale":"th","onlyOnNoPrefix":false,"onlyOnRoot":false,"useCookie":true},
  differentDomains: false,
  seo: false,
  baseUrl: "",
  vuex: {"moduleName":"i18n","syncLocale":false,"syncMessages":false,"syncRouteParams":true},
  parsePages: true,
  pages: {},
  skipSettingLocaleOnNavigate: false,
  beforeLanguageSwitch: () => null,
  onBeforeLanguageSwitch: () => {},
  onLanguageSwitched: () => null,
  normalizedLocales: [{"icon":"th","code":"th","file":"th.json"},{"icon":"en","code":"en","file":"en.json"}],
  localeCodes: ["th","en"],
}

export const localeMessages = {
  'th.json': () => import('../../lang/th.json' /* webpackChunkName: "lang-th.json" */),
  'en.json': () => import('../../lang/en.json' /* webpackChunkName: "lang-en.json" */),
}
