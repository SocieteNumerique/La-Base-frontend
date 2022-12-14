import { useBaseStore } from "~/stores/baseStore"

export const useIsBaseEditable = () => {
  const baseStore = useBaseStore()
  return computed(
    () =>
      baseStore.current?.canWrite || baseStore.current?.canAddResources || false
  )
}
