import { useResourceStore } from "~/stores/resourceStore"

export function useDuplicateResourceDetector() {
  const resourceStore = useResourceStore()
  const showDuplicateResourcesModal = ref(false)
  const duplicatedResourceIds = ref<number[]>([])

  const verifyDuplicatedResource = async () => {
    const { data } = await useApiGet<number[]>(
      `resources/${resourceStore.current.id}/duplicates/`,
      {
        title: resourceStore.current.title,
        description: resourceStore.current.description,
      }
    )
    duplicatedResourceIds.value = data.value || []
  }
  watch(
    () => resourceStore.current.title,
    () => verifyDuplicatedResource()
  )
  watch(
    () => resourceStore.current.description,
    () => verifyDuplicatedResource()
  )

  const onCloseDuplicateResourceModal = () => {
    showDuplicateResourcesModal.value = false
    verifyDuplicatedResource()
  }

  return {
    showDuplicateResourcesModal,
    duplicatedResourceIds,
    verifyDuplicatedResource,
    onCloseDuplicateResourceModal,
  }
}
