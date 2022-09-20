import VueDsfr from "@gouvminint/vue-dsfr"
import { icons } from "../icons"

export default defineNuxtPlugin((nuxtApp) => {
  // @ts-ignore
  nuxtApp.vueApp.use(VueDsfr, { icons: icons })
  return
})
