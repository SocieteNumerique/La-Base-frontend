<template>
  <ContentInputBase type="section" @exit="$emit('exit')" @save="saveSection">
    <DsfrInput
      v-model="section.title"
      :label-visible="true"
      label="Titre"
      hint="max 25 caractères"
      placeholder="Titre"
    />
  </ContentInputBase>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Section } from "~/composables/types"

defineEmits(["exit"])
defineProps({
  modelValue: { type: Object as PropType<Section>, required: true },
})
const section = useModel<Section>("modelValue", { type: "object" })

async function saveSection() {
  return updateSection(section.value)
}
</script>
