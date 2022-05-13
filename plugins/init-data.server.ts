import { defineNuxtPlugin } from "#app"
import { useBaseStore } from "~/stores/baseStore"
import { useUserStore } from "~/stores/userStore"
import { useMainStore } from "~/stores/mainStore"
import { useTagStore } from "~/stores/tagStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    const baseStore = useBaseStore()
    const mainStore = useMainStore()
    const tagStore = useTagStore()
    const userStore = useUserStore()

    baseStore.refreshBases()
    mainStore.refreshVersion()
    tagStore.refreshTagCategories()
    tagStore.refreshTags()
    userStore.refreshProfile()
  })
})
