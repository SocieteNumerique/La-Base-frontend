<template>
  <div>
    Ajouter :
    <div class="fr-grid-row">
      <button @click="$emit('new-solo-content', 'link')">Un lien</button>
      <button @click="$emit('new-solo-content', 'file')">Un fichier</button>
      <button @click="$emit('new-solo-content', 'text')">Un texte</button>
    </div>
    <draggable
      v-model="contentsBySection"
      :animation="100"
      :group="{
        name: 'sections',
        put: ['sections', 'groupedContents', 'soloContents'],
        pull: 'sections',
      }"
      class="sections"
      handle=".section-drag-handle"
      item-key="id"
      tag="ul"
      @update="sendNewSectionOrder"
    >
      <template #item="{ element: section, index: sectionIndex }">
        <div>
          <h2 v-if="section.isFoldable">{{ section.title }}</h2>
          <button v-if="section.isFoldable" class="section-drag-handle">
            drag {{ sectionIndex }}
          </button>
          <button
            v-if="section.isFoldable"
            @click="$emit('delete-section', sectionIndex)"
          >
            delete section
          </button>
          <draggable
            v-model="contentsBySection[sectionIndex].contents"
            :animation="100"
            :class="section.isFoldable ? 'grouped-contents' : 'solo-contents'"
            :group="draggableContentsGroup(section.isFoldable)"
            item-key="id"
            tag="ul"
            @add="sendNewContentOrder(sectionIndex)"
            @remove="onContentRemove(sectionIndex, $event)"
            @update="sendNewContentOrder(sectionIndex)"
          >
            <template #item="{ index: contentIndex }">
              <li draggable="true">
                <ContentListItem
                  v-model="
                    contentsBySection[sectionIndex].contents[contentIndex]
                  "
                  @delete="onDeleteContent(sectionIndex, contentIndex)"
                />
              </li>
            </template>
          </draggable>
          <button
            v-if="section.isFoldable"
            @click="
              $emit('new-content-in-section', { type: 'text', sectionIndex })
            "
          >
            new content in section
          </button>
        </div>
      </template>
    </draggable>
    <button @click="$emit('new-section', 'blablab')">new Section</button>
    <button @click="$emit('new-solo-content', 'text')">new content</button>
  </div>
</template>

<script lang="ts" setup>
import { Content, SectionWithContent } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"
import {
  updateContentOrder,
  updateSectionOrder,
} from "~/composables/contentsHelper"
// pycharm tells me that the import is not used, but it IS
import draggable from "vuedraggable"

defineProps({
  modelValue: {
    type: Object as PropType<SectionWithContent>,
    required: true,
  },
})
const emits = defineEmits({
  "new-solo-content"(type: string) {
    return ["text", "file", "link", "linkedResource"].includes(type)
  },
  "delete-content": null,
  "new-section": null,
  "new-content-in-section"({ type }: { type: string; sectionIndex: number }) {
    return ["text", "file", "link", "linkedResource"].includes(type)
  },
  "delete-section": null,
  "new-adhoc-section": null,
})

const draggableContentsGroup = computed(() => (isFoldable: boolean) => {
  return isFoldable
    ? {
        name: "groupedContents",
        pull: ["groupedContents", "sections"],
        put: ["groupedContents", "soloContents"],
      }
    : {
        name: "soloContents",
        pull: ["groupedContents", "sections"],
        put: [],
      }
})

const contentsBySection = useModel<SectionWithContent[]>("modelValue", {
  type: "array",
})

async function sendNewContentOrder(sectionIndex: number) {
  return updateContentOrder(
    contentsBySection.value[sectionIndex].contents,
    contentsBySection.value[sectionIndex].id
  )
}

async function sendNewSectionOrder() {
  return updateSectionOrder(contentsBySection.value)
}

function elementToType(element: HTMLElement) {
  for (const type of ["sections", "solo-contents", "grouped-contents"])
    if (element.classList.contains(type)) return type
}

async function onContentRemove(parentSectionIndex: number, payload: any) {
  const elementType = elementToType(payload.from)
  const arrivalType = elementToType(payload.to)
  if (elementType === "grouped-contents" && arrivalType === "sections") {
    return emits("new-adhoc-section", {
      prevSectionIndex: parentSectionIndex,
      contentIndex: payload.oldIndex,
      nextIndex: payload.newIndex,
    })
  }
  if (elementType === "solo-contents") {
    if (arrivalType === "grouped-contents") {
      emits("delete-section", parentSectionIndex)
    }
    if (arrivalType === "sections") {
      // content has been put among sections
      const content = contentsBySection.value[
        payload.newIndex
      ] as any as Content
      contentsBySection.value[payload.newIndex] =
        contentsBySection.value[parentSectionIndex]
      contentsBySection.value[payload.newIndex].contents.push(content)
      contentsBySection.value.splice(parentSectionIndex, 1)
      return sendNewSectionOrder()
    }
  }
}

function onDeleteContent(sectionIndex: number, contentIndex: number) {
  emits("delete-content", {
    id: contentsBySection.value[sectionIndex].contents[contentIndex].id,
    contentIndex,
    sectionIndex,
  })
}
</script>

<style lang="sass" scoped>
.section-drag-handle
  cursor: move
  cursor: -webkit-grabbing
</style>
