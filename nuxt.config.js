export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  server: {
    port: 5555
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'mder-frontend',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/fontawesome.js',
    '@/plugins/sweetalert2.js',
    '@/plugins/mask.js',
    '@/service/socket.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-i18n'
  ],

  router: {
    middleware: ['connectSocket']
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true
  },

  proxy: {
    '/api': 'http://localhost:3001'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  auth: {
    redirect: {
      login: '/',
      logout: '/',
      callback: '/',
      home: '/dashboard'
    },
    strategies: {
      local: {
        scheme: 'local',
        token: {
          property: 'token'
        },
        user: {
          property: 'user'
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' }
        }
      }
    }
  },

  i18n: {
    locales: [
      {
        icon: 'th',
        code: 'th',
        file: 'th.json'
      },
      {
        icon: 'en',
        code: 'en',
        file: 'en.json'
      }
    ],
    defaultLocale: 'th',
    lazy: true,
    langDir: 'lang/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      fallbackLocale: 'th'
    }
  }
}
