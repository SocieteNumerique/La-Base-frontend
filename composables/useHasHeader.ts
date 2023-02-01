import { onBeforeUnmount, onMounted } from "vue"
import { useMainStore } from "~/stores/mainStore"

// composable used to indicate that the page has a header
// and that the main content (for a11y ) starts on that header
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
