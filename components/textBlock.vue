<template>
  <div>
    <template v-if="slug">
      <div v-if="block" v-html="block"></div>
      <div v-else>
        Texte manquant pour le slug
        <pre style="display: inline">{{ props.slug }}</pre>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTextBlockStore } from "~/stores/textBlockStore"
import { computed } from "vue"

const props = defineProps({
  slug: { type: String, required: true },
})

const textBlockStore = useTextBlockStore()
const block = computed(() => textBlockStore.blockBySlug[props.slug])
</script>
