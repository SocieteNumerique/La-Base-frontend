import { useBaseStore } from "~/stores/baseStore"
import { useUserStore } from "~/stores/userStore"
import { useMainStore } from "~/stores/mainStore"
import { useTagStore } from "~/stores/tagStore"
import { usePageStore } from "~/stores/pageStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    // the data should already be fetched from SSR
    // but if it's missing, we try again from the client

    const baseStore = useBaseStore()
    if (!baseStore.basesOrder.length) {
      baseStore.refreshBases()
    }

    const mainStore = useMainStore()
    if (!mainStore.version) {
      mainStore.refreshVersion()
    }

    const tagStore = useTagStore()
    if (!Object.keys(tagStore.tagCategoriesById).length) {
      tagStore.refreshIndex()
    }

    const userStore = useUserStore()
    if (!userStore.email) {
      userStore.refreshProfile()
    }

    const pageStore = usePageStore()
    if (!Object.keys(pageStore.pagesBySlug).length) {
      pageStore.getPages()
    }
  })
})
