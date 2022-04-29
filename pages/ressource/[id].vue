<template>
  <ResourceEditingMain />
</template>

<script setup lang="ts">
import { onMounted } from "@vue"

import { useResourceStore } from "~/stores/resourceStore"
import { Resource } from "~/composables/types"

definePageMeta({
  layout: "resource",
  title: "Ressource",
})

const route = useRoute()
const resourceStore = useResourceStore()

let resourceId: number

onMounted(() => {
  resourceId = parseInt(route.params.id)
  if (resourceStore.resourcesById[resourceId]?.isShort) {
    console.log("is short")
    resourceStore.getResource(resourceId)
  }
})

const resource = computed((): Resource | undefined => {
  if (!resourceId) {
    return undefined
  }
  return resourceStore.resourcesById[resourceId]
})
</script>
