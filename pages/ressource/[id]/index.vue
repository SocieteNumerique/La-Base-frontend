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
import { onBeforeUnmount, onMounted } from "vue"

definePageMeta({
  layout: false,
})

const mainStore = useMainStore()
</script>
