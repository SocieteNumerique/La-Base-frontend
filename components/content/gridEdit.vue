<template>
  <div>
    <ContentGridSectionEdit
      v-for="(section, index) of sections"
      :key="section.id"
      v-model="sections[index]"
      v-model:editing-content="currentEditingContentId"
      @new-content="onNewContentInSection($event, index)"
      @delete-section="$emit('delete-section', index)"
      @delete-content="
        $emit('delete-content', {
          id: $event.id,
          contentIndex: $event.index,
          sectionIndex: index,
        })
      "
      @swap-one="swapOne(index, $event)"
    />

    <div class="fr-btns-group fr-btns-group--inline">
      <ContentInputChooseType
        @new-content="$emit('new-solo-content', $event)"
      />
      <button
        class="fr-btn fr-btn--tertiary fr-btn--sm"
        @click="$emit('new-section', 'Nouvelle section')"
      >
        Créer une section
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SectionWithContent } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"
import { orderSwap } from "~/composables/contentsHelper"

defineProps({
  modelValue: {
    type: Array as PropType<SectionWithContent[]>,
    default: () => [],
  },
  enabled: { type: Boolean, default: false },
  editingContent: { type: Number, default: null },
})

const emits = defineEmits([
  "new-solo-content",
  "delete-content",
  "new-section",
  "new-content-in-section",
  "update:editing-content",
])

const sections = useModel<SectionWithContent[]>("modelValue", { type: "array" })
const currentEditingContentId = useModel<number>("editingContent")

async function swapOne(index: number, direction: number) {
  orderSwap(sections.value, index, direction)
  return updateSectionOrder(sections.value)
}

function onNewContentInSection(payload: any, sectionIndex: number) {
  emits("new-content-in-section", { ...payload, sectionIndex })
}
</script>
