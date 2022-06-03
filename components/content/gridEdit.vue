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

    <div class="fr-btns-group add-section-content-group">
      <ContentInputChooseType
        @new-content="$emit('new-solo-content', $event)"
      />
      <div>
        <button
          class="fr-btn fr-btn--tertiary fr-btn--sm"
          @click="$emit('new-section', 'Nouvelle section')"
        >
          <VIcon name="ri-folder-add-line" />
          Créer une section
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SectionWithContent } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"
import {
  checkAndMerge,
  orderSwap,
  updateSectionOrder,
} from "~/composables/contentsHelper"

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
  "delete-section",
  "new-section",
  "new-content-in-section",
  "update:editing-content",
  "reload-contents",
])

const sections = useModel<SectionWithContent[]>("modelValue", { type: "array" })
const currentEditingContentId = useModel<number>("editingContent")

async function swapOne(index: number, direction: number) {
  await orderSwap(sections.value, index, direction)
  await updateSectionOrder(sections.value)
  await checkAndMerge(sections.value, index)
  await checkAndMerge(sections.value, index + direction)
  emits("reload-contents")
}

function onNewContentInSection(payload: any, sectionIndex: number) {
  emits("new-content-in-section", { ...payload, sectionIndex })
}
</script>
