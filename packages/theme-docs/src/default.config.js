import { themeModule } from './theme.module'

export const defaultConfig = (docsOptions) => ({
  server: {
    host: '0.0.0.0'
  },
  target: 'static',
  ssr: true,
  srcDir: __dirname,
  privateRuntimeConfig: {
    githubToken: process.env.GITHUB_TOKEN
  },
  head: {
    meta: [ { charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' } ]
  },
  generate: {
    fallback: '404.html',
    routes: [ '/' ]
  },
  transpile: [
    __dirname // transpile node_modules/@nuxt/content-theme-docs
  ],
  css: [ '~/assets/css/main.css' ],
  plugins: [ '@/plugins/markdown', '@/plugins/init', '@/plugins/i18n.client', '@/plugins/vue-scrollactive', '@/plugins/menu.client' ],
  buildModules: [ themeModule, '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxtjs/pwa', '@nuxtjs/google-fonts', '@nuxtjs/fontawesome', '@nuxtjs/composition-api/module' ],
  colorMode: {
    classSuffix: ''
  },
  modules: [ '@nuxtjs/i18n', '@nuxt/content', '@nuxt/components', '@nuxtjs/axios' ],
  components: true,
  loading: {
    color: docsOptions.primaryColor
  },
  meta: {
    theme_color: docsOptions.primaryColor
  },
  content: {
    markdown: {
      prism: {
        theme: 'prism-theme-one-dark/prism-onedark.css'
      }
    }
  },
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.js',
        name: 'English'
      }
    ],
    defaultLocale: 'en',
    parsePages: false,
    lazy: true,
    seo: false,
    langDir: 'i18n/',
    vueI18n: {
      fallbackLocale: 'en',
      dateTimeFormats: {
        en: {
          long: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short'
          }
        },
        fr: {
          long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
          }
        }
      }
    }
  },
  googleFonts: {
    families: {
      'DM+Sans': true,
      'DM+Mono': true
    }
  },
  tailwindcss: {
    mode: 'jit'
  }
})
