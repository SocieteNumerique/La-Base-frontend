<template>
  <NuxtLayout name="default">
    <template #header>
      <div></div>
    </template>
    <ResourceView :is-preview="false" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useFullWidth } from "~/composables/useFullWidth"
import { onMounted } from "vue"
import { useRegisterVisit } from "~/composables/visits"
import { useResourceStore } from "~/stores/resourceStore"

definePageMeta({
  layout: false,
})

onMounted(() => {
  const resourceStore = useResourceStore()
  useRegisterVisit("resource", resourceStore.currentId!)
})

useFullWidth()
</script>
