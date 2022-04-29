<template>
  <ResourceEditingMain />
</template>

<script setup lang="ts">
import { onMounted } from "vue"

import { useResourceStore } from "~/stores/resourceStore"
import { Resource } from "~/composables/types"

definePageMeta({
  layout: "resource",
  title: "Ressource",
})

const route = useRoute()
const resourceStore = useResourceStore()

let resourceId: number

const getResourceIfNotExists = (resourceId: number): void => {
  resourceStore.setCurrentId(resourceId)
  if (
    !resourceStore.resourcesById[resourceId] ||
    resourceStore.resourcesById[resourceId].isShort
  ) {
    console.log("### getting resource :)")
    resourceStore.getResource(resourceId)
  }
}

if (process.server) {
  resourceId = parseInt(route.params.id)
  console.log(
    "### this is on the server !!",
    route.params.id,
    !resourceStore.resourcesById[resourceId] ||
      resourceStore.resourcesById[resourceId].isShort
  )
  getResourceIfNotExists(resourceId)
}
onMounted(() => {
  resourceId = parseInt(route.params.id)
  console.log("### in client", resourceId, resourceStore.resourcesById)
  getResourceIfNotExists(resourceId)
})

const resource = computed((): Resource | undefined => {
  if (!resourceId) {
    return undefined
  }
  return resourceStore.resourcesById[resourceId]
})
</script>
