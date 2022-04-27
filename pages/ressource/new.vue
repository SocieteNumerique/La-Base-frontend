<template>
  <NuxtLayout name="resource">
    <ResourceEditingMain />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"
import {onBeforeUnmount } from "vue"

definePageMeta({
  layout: false,
  title: "Nouvelle fiche ressource",
})

const resourceStore = useResourceStore()
resourceStore.isCreating = true

onBeforeUnmount(() => {
  resourceStore.isCreating = false
})
</script>
