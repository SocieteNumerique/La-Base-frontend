import { defineNuxtPlugin } from "#app"
import { useBaseStore } from "~/stores/baseStore"
import { useUserStore } from "~/stores/userStore"
import { useMainStore } from "~/stores/mainStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    const baseStore = useBaseStore()
    const userStore = useUserStore()
    const mainStore = useMainStore()

    baseStore.refreshBases()
    userStore.refreshProfile()
    mainStore.refreshVersion()
  })
})
