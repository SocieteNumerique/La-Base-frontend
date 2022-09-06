import VueMatomo from "vue-matomo"
import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin((nuxtApp) => {
  console.log("### analytics", nuxtApp.vueApp, VueMatomo)
  nuxtApp.vueApp.use(VueMatomo, {
    debug: true,
    host: "https://labaseanct.matomo.cloud",
    siteId: 1,
    requireConsent: false,
    // router: nuxtApp.router,
    trackInitialView: true,
  })
})
