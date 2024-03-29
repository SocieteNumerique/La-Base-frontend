// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["@gouvminint/vue-dsfr/styles", "@/css/moine.sass"],
  head: {
    title: "La Base du numérique d'intérêt général",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description", // not sure what's this
        name: "La Base regroupe les ressources des professionnels du numérique d’intérêt général.",
        content: "my website description",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  ignore: ["**/*.test.*", "**/*.spec.*", "**/*.cy.*"],
  modules: ["@pinia/nuxt", "vue-plausible"],
  build: {
    transpile: ["oh-vue-icons"],
  },
  plausible: {
    // Use as fallback if no runtime config is available at runtime
    domain: process.env.PLAUSIBLE_DOMAIN,
  },
  runtimeConfig: {
    public: {
      plausible: {
        domain: process.env.PLAUSIBLE_DOMAIN,
      },
    },
  },
})
