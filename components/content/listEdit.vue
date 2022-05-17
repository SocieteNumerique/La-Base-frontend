<template>
  <div>
    Ajouter :
    <div class="fr-grid-row">
      <button @click="$emit('new-solo-content', 'link')">Un lien</button>
      <button @click="$emit('new-solo-content', 'file')">Un fichier</button>
      <button @click="$emit('new-solo-content', 'text')">Un texte</button>
    </div>
    <template
      v-for="(section, sectionIndex) of contentsBySection"
      :key="section.id"
    >
      <h2 v-if="section.isFoldable">{{ section.title }}</h2>
      <button @click="$emit('delete-section', sectionIndex)">
        delete section
      </button>
      <draggable
        v-model="contentsBySection[sectionIndex].contents"
        :animation="100"
        group="contents"
        item-key="id"
        tag="ul"
        @change="sendNewOrder(sectionIndex)"
      >
        <template #item="{ index: contentIndex }">
          <li draggable="true">
            <ContentListItem
              v-model="contentsBySection[sectionIndex].contents[contentIndex]"
              @delete="
                $emit('delete-content', {
                  id: contentsBySection[sectionIndex].contents[contentIndex].id,
                  contentIndex,
                  sectionIndex,
                })
              "
            />
          </li>
        </template>
      </draggable>
      <button
        @click="$emit('new-content-in-section', { type: 'text', sectionIndex })"
      >
        new content in section
      </button>
    </template>
    <button @click="$emit('new-section', 'blablab')">new Section</button>
    <button @click="$emit('new-solo-content', 'text')">new content</button>
  </div>
</template>

<script lang="ts" setup>
import { Content, SectionWithContent } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"
import { updateOrder } from "~/composables/contentsHelper"
// pycharm tells me that the import is not used, but it IS
import draggable from "vuedraggable"

defineProps({
  modelValue: {
    type: Object as PropType<SectionWithContent>,
    required: true,
  },
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

const contentsBySection = useModel<SectionWithContent[]>("modelValue", {
  type: "array",
})

async function sendNewOrder(sectionIndex: number) {
  return updateOrder(
    contentsBySection.value[sectionIndex].contents,
    contentsBySection.value[sectionIndex].id
  )
}
</script>

<style lang="sass" scoped></style>
