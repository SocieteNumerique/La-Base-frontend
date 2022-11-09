import { useBaseStore } from "~/stores/baseStore"
import { useUserStore } from "~/stores/userStore"
import { useMainStore } from "~/stores/mainStore"
import { useTagStore } from "~/stores/tagStore"
import { usePageStore } from "~/stores/pageStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    useBaseStore().refreshBases()
    useTagStore().refreshIndex()
    useUserStore().refreshProfile()
    usePageStore().getPages()
  })
})
