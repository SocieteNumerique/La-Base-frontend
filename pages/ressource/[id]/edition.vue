<template>
  <ResourceEditingMain />
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { useRoute } from "vue-router"
import { onBeforeUnmount, onMounted } from "vue"
import { useMainStore } from "~/stores/mainStore"

definePageMeta({
  layout: "resourceedition",
  title: "Ressource",
})
const resourceStore = useResourceStore()
const mainStore = useMainStore()
const route = useRoute()

function onBeforeUnload(ev: Event) {
  if (resourceStore.current.dirty) {
    ev.preventDefault()
    ev.returnValue = "Attention, la ressource n'a pas été sauvegardée"
    return
  }
}

if (process.server) {
  mainStore.useFullWidthLayout = true
} else {
  onMounted(() => {
    window.addEventListener("beforeunload", onBeforeUnload)
    mainStore.useFullWidthLayout = true
  })
}
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", onBeforeUnload)
  mainStore.useFullWidthLayout = false
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
