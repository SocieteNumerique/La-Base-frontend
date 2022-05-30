<template>
  <div>
    <div v-if="content.withPreview" class="link-preview"><!-- TODO --></div>
    <VIcon name="link-line" />
    <a :href="content.link">{{ content.link }}</a>
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
