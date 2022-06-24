<template>
  <ResourceEditingMain />
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { onBeforeUnmount, onMounted } from "vue"
import { useFullWidth } from "~/composables/useFullWidth"
import { useAlertStore } from "~/stores/alertStore"
import { getResourceIfNotExists } from "~/composables/resource"

definePageMeta({
  layout: "resourceedition",
  title: "Ressource",
})
const resourceStore = useResourceStore()
const alertStore = useAlertStore()
const router = useRouter()

function onBeforeUnload(ev: Event) {
  if (resourceStore.current.dirty) {
    ev.preventDefault()
    ev.returnValue = "Attention, la ressource n'a pas été sauvegardée"
    return
  }
}

useFullWidth()
onMounted(() => {
  window.addEventListener("beforeunload", onBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", onBeforeUnload)
  resourceStore.resetNavigation()
})

if (process.server) {
  getResourceIfNotExists()
}

onMounted(async () => {
  await getResourceIfNotExists()
  if (!resourceStore.current.canWrite) {
    alertStore.alert(
      "Vous n'avez pas le droit d'éditer cette ressource",
      "",
      "error"
    )
    router.replace(`/ressource/${resourceStore.currentId}`)
  }
})
</script>
