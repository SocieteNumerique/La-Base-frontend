import { defineNuxtConfig } from "nuxt"

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
