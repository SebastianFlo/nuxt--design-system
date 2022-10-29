const command = process.argv.slice(2)[0];
const isDev = !command;

export default {
  env: {
    sifApi:
      process.env.API_TARGET === 'production'
        ? 'PRODUCTION_API_HERE'
        : 'DEVELOPMENT_API_HERE',
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt--design-system',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com/',
        crossorigin: 'anonymous',
      },
      {
        rel: 'preload',
        as: 'style',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        crossorigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        media: 'print',
        onload: 'this.media="all"',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        as: 'fetch',
        crossorigin: 'anonymous',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/styles/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    // Structural components for demo purposes.
    // not exported.
    {
      path: '~/components',
      extensions: ['vue'],
      pathPrefix: false,
    },
    // Cms components mapped directly to storyblok,
    // will be exported.
    {
      path: '~/package',
      extensions: ['vue'],
      pathPrefix: false,
      transpile: true,
    },
    // Important: DO NOT add the remaining './package' paths,
    // as we need to make sure our exported component dependencies are explicit,
    // so we don't accidentaly import/export the wrong thing, or too much.
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',

    // svg inline
    '@nuxtjs/svg',

    // https://github.com/ivodolenc/nuxt-gsap-module
    'nuxt-gsap-module',

    // design system module
    '@seftek/design-system',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxt/http',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

    // https://github.com/vuestorefront/storefront-ui/tree/develop/packages/nuxt-module
    '@storefront-ui/nuxt',

    // https://github.com/storyblok/nuxtjs-multilanguage-website
    // https://github.com/storyblok/storyblok-nuxt
    [
      'storyblok-nuxt',
      {
        accessToken: 'SPACE_TOKEN_HERE',
        cacheProvider: 'memory',
      },
    ],
  ],

  // Get that animation going on
  gsap: {
    extraPlugins: {
      scrollTo: true,
      scrollTrigger: true,
    },
  },

  // Nuxt http module configuration
  http: {
    retry: {
      statusCodes: [401],
      limit: 2,
      methods: ['get', 'post', 'put', 'delete'],
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build

  server: isDev
    ? {
        port: 3003,
      }
    : undefined,
};
