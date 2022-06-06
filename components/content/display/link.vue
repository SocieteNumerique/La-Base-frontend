<template>
  <div>
    <div v-if="content.withPreview" class="link-preview"><!-- TODO --></div>
    <VIcon class="fr-mr-1w" name="ri-link" />
    <a
      :href="content.link"
      class="no-underline no-append-ico fr-text-title--blue-france"
      rel="noopener noreferrer"
      target="_blank"
    >
      {{ content.link }}
    </a>
    <!-- TODO only host -->
  </div>
</template>

<script lang="ts" setup>
import { LinkContent } from "~/composables/types"
import { PropType } from "vue"

defineProps({
  content: { type: Object as PropType<LinkContent>, required: true },
})
</script>

<style lang="sass" scoped></style>
