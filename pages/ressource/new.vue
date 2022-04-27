<template>
  <ResourceEditingMain />
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"
import { onBeforeUnmount } from "vue"

definePageMeta({
  layout: "resource",
  title: "Nouvelle fiche ressource",
})

const resourceStore = useResourceStore()
resourceStore.isCreating = true

onBeforeUnmount(() => {
  resourceStore.isCreating = false
})
</script>
