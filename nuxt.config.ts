import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  css: ['~/assets/dsfr-imports.css', '~/assets/app.css'],

  buildModules: ['@pinia/nuxt'],
  build: {
    transpile: [
      'oh-vue-icons/dist/v3/icon.es',
      'oh-vue-icons/icons/ri/index',
      '@laruiss/vue-dsfr',
    ],
  },
  vue: {
    config: {
      productionTip: false,
      devtools: true,
    },
  },
})
