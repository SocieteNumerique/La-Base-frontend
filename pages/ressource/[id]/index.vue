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

definePageMeta({
  layout: false,
})

useFullWidth()
</script>
