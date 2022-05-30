<template>
  {{ content.text }}
</template>

<script lang="ts" setup>
import { TextContent } from "~/composables/types"
import { PropType } from "vue"

defineProps({
  content: { type: Object as PropType<TextContent>, required: true },
})
</script>

<style lang="sass" scoped></style>
