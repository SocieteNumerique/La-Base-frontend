import { useBaseStore } from "~/stores/baseStore"
import { useUserStore } from "~/stores/userStore"
import { useTagStore } from "~/stores/tagStore"
import { usePageStore } from "~/stores/pageStore"
import { useTextBlockStore } from "~/stores/textBlockStore"
import { useUserSearchStore } from "~/stores/userSearchStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    // the data should already be fetched from SSR
    // but if it's missing, we try again from the client

    const baseStore = useBaseStore()
    if (!baseStore.basesOrder.length) {
      baseStore.refreshBases()
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

    const textBlockStore = useTextBlockStore()
    if (!Object.keys(textBlockStore.blockBySlug).length) {
      textBlockStore.getTextBlocks()
    }

    const userSearchStore = useUserSearchStore()
    if (!Object.keys(userSearchStore.userSearchById).length) {
      userSearchStore.getUserSearches()
    }
  })
})
