import { onBeforeUnmount, onMounted } from "vue"
import { useMainStore } from "~/stores/mainStore"

export const useHasHeader = () => {
  const mainStore = useMainStore()
  if (process.server) {
    // TODO below value should actually be true, but due
    //   to an SSR bug it does not work
    mainStore.hasHeader = false
  } else {
    onMounted(() => {
      mainStore.hasHeader = true
    })
    onBeforeUnmount(() => {
      mainStore.hasHeader = false
    })
  }
}
