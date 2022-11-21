<template>
  <FormRichTextInput v-model="content.text" :toolbar-options="toolbarOptions" />
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { TextContent } from "~/composables/types"

defineProps({
  modelValue: { type: Object as PropType<TextContent>, required: true },
})

const content = useModel<TextContent>("modelValue", { type: "object" })
const toolbarOptions = {
  headingSwitch: {
    h1: 4,
    h2: 5,
    h3: 6,
  },
}
</script>

<style lang="sass" scoped></style>
