<template>
  <ResourceEditingMain />
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { onBeforeUnmount, onMounted } from "vue"
import { useMainStore } from "~/stores/mainStore"
import { useAlertStore } from "~/stores/alertStore"

definePageMeta({
  layout: "resourceedition",
  title: "Ressource",
})
const resourceStore = useResourceStore()
const mainStore = useMainStore()
const alertStore = useAlertStore()
const router = useRouter()

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
