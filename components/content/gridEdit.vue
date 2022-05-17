<template>
  <div>
    Ajouter :
    <div class="fr-grid-row">
      <button @click="$emit('new-solo-content', 'link')">Un lien</button>
      <button @click="$emit('new-solo-content', 'file')">Un fichier</button>
      <button @click="$emit('new-solo-content', 'text')">Un texte</button>
    </div>
    <button @click="$emit('new-section', 'default name')">
      Ajouter une section
    </button>
    <ContentGridSectionEdit
      v-for="(section, index) of sections"
      :key="section.id"
      v-model="sections[index]"
      @new-content="
        $emit('new-content-in-section', { type: 'text', sectionIndex: index })
      "
      @delete-section="$emit('delete-section', index)"
      @delete-content="
        $emit('delete-content', {
          id: $event.id,
          contentIndex: $event.index,
          sectionIndex: index,
        })
      "
    />

    <button @click="$emit('new-section', 'blablab')">new Section</button>
    <button @click="$emit('new-solo-content', 'text')">new content</button>
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
  enabled: { type: Boolean, default: false },
})

defineEmits({
  "new-solo-content"(type: string) {
    return ["text", "file", "link", "linkedResource"].includes(type)
  },
  "delete-content": null,
  "new-section": null,
  "new-content-in-section"({
    type,
    sectionIndex,
  }: {
    type: string
    sectionIndex: number
  }) {
    return ["text", "file", "link", "linkedResource"].includes(type)
  },
  "delete-section": null,
})

const sections = useModel<SectionWithContent[]>("modelValue", { type: "array" })
</script>
