import { onBeforeUnmount, onMounted } from "vue"
import { useMainStore } from "~/stores/mainStore"

export const useFullWidth = () => {
  const mainStore = useMainStore()
  if (process.server) {
    // TODO below value should actually be true, but due
    //   to an SSR bug it does not work
    mainStore.setFullWidth(false)
  } else {
    onMounted(() => {
      mainStore.setFullWidth(true)
    })
    onBeforeUnmount(() => {
      mainStore.setFullWidth(false)
    })
  }
}
