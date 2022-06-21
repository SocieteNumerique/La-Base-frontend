<template>
  <NuxtLayout name="default">
    <template #header>
      <div></div>
    </template>
    <ResourceView :is-preview="false" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useMainStore } from "~/stores/mainStore"

definePageMeta({
  layout: false,
})
</script>
