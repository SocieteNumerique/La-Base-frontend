import { defineNuxtPlugin } from "#app"
import VueDsfr from "@laruiss/vue-dsfr/"

import "../icons"

export default defineNuxtPlugin((nuxtApp) => {
  // @ts-ignore
  nuxtApp.vueApp.use(VueDsfr)
  return
})
