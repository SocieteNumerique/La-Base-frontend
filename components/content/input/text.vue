<template>
  <DsfrInput
    v-model="content.text"
    label="Le texte"
    :label-visible="true"
    placeholder="Le texte"
    :is-textarea="true"
  />
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { TextContent } from "~/composables/types"

defineProps({
  modelValue: { type: Object as PropType<TextContent>, required: true },
})

const content = useModel("modelValue", { type: "object" })
</script>
