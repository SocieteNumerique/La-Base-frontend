<template>
  <div>
    <ContentGridSection
      v-for="(section, index) of sections"
      :key="section.id"
      v-model="sections[index]"
    />
  </div>
</template>

<script lang="ts" setup>
import { SectionWithContent } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"

defineProps({
  modelValue: {
    type: Array as PropType<SectionWithContent[]>,
    default: () => [],
  },
})

const sections = useModel<SectionWithContent[]>("modelValue", { type: "array" })
</script>
