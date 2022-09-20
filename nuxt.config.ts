// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["@gouvminint/vue-dsfr/styles", "@/css/moine.sass"],
  ignore: ["**/*.test.*", "**/*.spec.*", "**/*.cy.*"],
  modules: ["@pinia/nuxt"],
  build: {
    transpile: ["oh-vue-icons"],
  },
})
