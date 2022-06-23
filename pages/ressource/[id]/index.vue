<template>
  <NuxtLayout name="default">
    <template #header>
      <div></div>
    </template>
    <ResourceView :is-preview="false" />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})
</script>
