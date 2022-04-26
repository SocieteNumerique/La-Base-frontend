import { defineNuxtPlugin } from '#app'
import { useBaseStore } from '~/stores/baseStore'
import { useUserStore } from '~/stores/userStore'
import { useMainStore } from '~/stores/mainStore'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    // the data should already be fetched from SSR
    // but if it's missing, we try again from the client

    const baseStore = useBaseStore()
    if (!baseStore.basesOrder.length) {
      baseStore.refreshBases()
    }
    const userStore = useUserStore()
    if (!userStore.email) {
      userStore.refreshProfile()
    }

    const mainStore = useMainStore()
    if (!mainStore.version) {
      mainStore.refreshVersion()
    }
  })
})
