<template>
  <ContentInputBase type="section" @exit="$emit('exit')" @save="saveSection">
    <DsfrInput
      v-model="section.title"
      :label-visible="true"
      label="Titre"
      :hint="`${getLengthOrZero(section.title)} / 100 caractères`"
      placeholder="Titre"
      maxlength="100"
    />
  </ContentInputBase>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Section } from "~/composables/types"
import { getLengthOrZero } from "~/composables/utils"

const emit = defineEmits(["exit"])
defineProps({
  modelValue: { type: Object as PropType<Section>, required: true },
})
const section = useModel<Section>("modelValue", { type: "object" })

async function saveSection() {
  await updateSection(section.value)
  emit("exit")
}
</script>
