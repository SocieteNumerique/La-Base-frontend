<template>
  <FormRichTextInput v-model="content.text" :toolbar-options="toolbarOptions" />
</template>

<script setup lang="ts">
import { PropType } from "vue"
import {
  Heading,
  RichTextToolbarOptions,
  TextContent,
} from "~/composables/types"

defineProps({
  modelValue: { type: Object as PropType<TextContent>, required: true },
})

const content = useModel<TextContent>("modelValue", { type: "object" })
const toolbarOptions: RichTextToolbarOptions = {
  headingSwitch: {
    [Heading.H1]: 4,
    [Heading.H2]: 5,
    [Heading.H3]: 6,
  },
}
</script>

<style lang="sass" scoped></style>
