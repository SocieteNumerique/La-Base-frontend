<template>
  <ResourceEditingMain />
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { useRoute } from "vue-router"
import { onBeforeUnmount, onMounted } from "vue"

definePageMeta({
  layout: "resourceedition",
  title: "Ressource",
})
const route = useRoute()
const resourceStore = useResourceStore()

function onBeforeUnload(ev: Event) {
  if (resourceStore.current.dirty) {
    ev.preventDefault()
    ev.returnValue = "Attention, la ressource n'a pas été sauvegardée"
    return
  }
}

onMounted(() => {
  window.addEventListener("beforeunload", onBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", onBeforeUnload)
})

const getResourceIfNotExists = (): void => {
  const resourceId = parseInt(route.params.id)
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
  getResourceIfNotExists()
}
onMounted(() => {
  getResourceIfNotExists()
})
</script>
