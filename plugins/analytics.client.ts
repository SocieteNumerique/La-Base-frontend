import VueMatomo from "vue-matomo"
import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMatomo, {
    host: "https://labase.anct.gouv.fr",
    siteId: 3,
    requireConsent: false,
    router: nuxtApp.router,
    trackInitialView: true,
  })
})
