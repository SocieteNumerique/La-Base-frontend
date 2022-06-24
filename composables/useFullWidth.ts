import { onBeforeUnmount, onMounted } from "vue"
import { useMainStore } from "~/stores/mainStore"

export const useFullWidth = () => {
  const mainStore = useMainStore()
  if (process.server) {
    mainStore.useFullWidthLayout = true
  } else {
    onMounted(() => {
      mainStore.useFullWidthLayout = true
    })
    onBeforeUnmount(() => {
      mainStore.useFullWidthLayout = false
    })
  }
}
