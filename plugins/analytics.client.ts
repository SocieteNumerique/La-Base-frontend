import VueMatomo from "vue-matomo"
import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMatomo, {
    host: "https://labaseanct.matomo.cloud",
    siteId: 1,
    requireConsent: false,
    router: nuxtApp.router,
    trackInitialView: true,
  })
})
