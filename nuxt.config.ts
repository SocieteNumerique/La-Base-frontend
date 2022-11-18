// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: "La Base du numérique d'intérêt général",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description", // not sure what's this
          name: "La Base regroupe les ressources des professionnels du numérique d’intérêt général dont l’inclusion et la médiation numériques.",
          content: "my website description",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    pageTransition: false,
    layoutTransition: false,
  },
  css: ["@gouvminint/vue-dsfr/styles", "@/css/moine.sass"],
  ignore: ["**/*.test.*", "**/*.spec.*", "**/*.cy.*"],
  modules: ["@pinia/nuxt"],
  build: {
    transpile: ["oh-vue-icons"],
  },
})
