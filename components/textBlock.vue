<template>
  <div>
    <template v-if="slug">
      <div v-if="block" v-html="block"></div>
      <div v-else-if="userStore.isAdmin" class="missing-content">
        Texte manquant pour le slug
        <pre style="display: inline">{{ props.slug }}</pre>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTextBlockStore } from "~/stores/textBlockStore"
import { computed } from "vue"
import { useUserStore } from "~/stores/userStore"

const userStore = useUserStore()

const props = defineProps({
  slug: { type: String, required: true },
})

const textBlockStore = useTextBlockStore()
const block = computed(() => textBlockStore.blockBySlug[props.slug])
</script>

<style>
.missing-content {
  font-weight: bold;
  color: red;
}
</style>
