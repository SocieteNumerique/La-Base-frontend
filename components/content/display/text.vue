<template>
  <!-- eslint-disable vue/no-v-html -->
  <div v-html="content.text" />
  <!-- eslint-enable -->
</template>

<script lang="ts" setup>
import { TextContent } from "~/composables/types"
import { PropType } from "vue"

defineProps({
  content: { type: Object as PropType<TextContent>, required: true },
})
</script>

<style lang="sass" scoped></style>
