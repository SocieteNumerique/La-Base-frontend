import { defineNuxtConfig } from "nuxt3"

export default defineNuxtConfig({
  css: ["~/assets/dsfr-imports.css", "@/css/moine.sass"],

  buildModules: ["@pinia/nuxt"],
  build: {
    transpile: ["@laruiss/vue-dsfr"],
  },
  vue: {
    config: {
      productionTip: false,
      devtools: true,
    },
  },
})
