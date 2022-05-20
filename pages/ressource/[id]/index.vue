<template>
  <div>
    <template v-if="resourceStore.current">
      <h1>{{ resourceStore.current.title }}</h1>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

definePageMeta({
  layout: "default",
  title: "Ressource",
})
const route = useRoute()
const resourceStore = useResourceStore()

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
