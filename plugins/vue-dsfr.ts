import { defineNuxtPlugin } from "#app"
import VueDsfr from "@laruiss/vue-dsfr"

import { icons } from "../icons"

export default defineNuxtPlugin((nuxtApp) => {
  // @ts-ignore
  nuxtApp.vueApp.use(VueDsfr, { icons })
  return
})
