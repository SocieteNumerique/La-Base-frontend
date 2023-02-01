import { useBaseStore } from "~/stores/baseStore"
import { useUserStore } from "~/stores/userStore"
import { useTagStore } from "~/stores/tagStore"
import { usePageStore } from "~/stores/pageStore"
import { useTextBlockStore } from "~/stores/textBlockStore"
import { useUserSearchStore } from "~/stores/userSearchStore"
import { useEvaluationStore } from "~/stores/evaluationStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    useBaseStore().refreshBases()
    useEvaluationStore().getCriteria()
    useTagStore().refreshIndex()
    useUserStore().refreshProfile()
    usePageStore().getPages()
    useTextBlockStore().getTextBlocks()
    useUserSearchStore().getUserSearches()
  })
})
