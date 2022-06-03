<template>
  <div>
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
      @add="onAddAmongSections"
    >
      <template #item="{ element: section, index: sectionIndex }">
        <div>
          <template v-if="section.isFoldable">
            <h2>{{ section.title }}</h2>
            <button class="section-drag-handle">drag {{ sectionIndex }}</button>
            <button @click="currentEditingSectionId = section.id">
              éditer
            </button>
            <ContentInputSection
              v-if="currentEditingSectionId === section.id"
              v-model="contentsBySection[sectionIndex]"
              @exit="currentEditingSectionId = null"
            />
            <button @click="$emit('delete-section', sectionIndex)">
              delete section
            </button>
          </template>
          <draggable
            v-model="contentsBySection[sectionIndex].contents"
            :animation="100"
            :class="section.isFoldable ? 'grouped-contents' : 'solo-contents'"
            :group="draggableContentsGroup(section.isFoldable)"
            item-key="id"
            tag="ul"
            @add="sendNewContentOrder(sectionIndex, $event)"
            @update="sendNewContentOrder(sectionIndex, $event)"
          >
            <template #item="{ element: content, index: contentIndex }">
              <li draggable="true">
                <ContentListItem
                  v-model="
                    contentsBySection[sectionIndex].contents[contentIndex]
                  "
                  :is-editing="currentEditingContentId === content.id"
                  @delete="onDeleteContent(sectionIndex, contentIndex)"
                  @open-edition="currentEditingContentId = content.id"
                  @exit-edition="currentEditingContentId = null"
                />
              </li>
            </template>
          </draggable>
          <ContentInputChooseType
            v-if="section.isFoldable"
            @new-content="onNewContentInSection($event, sectionIndex)"
          >
            Ajouter un contenu à {{ section.title }}
          </ContentInputChooseType>
        </div>
      </template>
    </draggable>
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
import { Content, SectionWithContent } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"
import {
  checkAndMerge,
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
  editingContent: { type: Number, default: undefined },
})
const emits = defineEmits([
  "new-solo-content",
  "delete-content",
  "new-section",
  "new-content-in-section",
  "delete-section",
  "new-adhoc-section",
  "update:editing-content",
  "reload-contents",
])

const draggableContentsGroup = computed(() => (isFoldable: boolean) => {
  return {
    name: isFoldable ? "groupedContents" : "soloContents",
    pull: ["groupedContents", "sections", "soloContents"],
    put: ["groupedContents", "soloContents"],
  }
})

const contentsBySection = useModel<SectionWithContent[]>("modelValue", {
  type: "array",
})
const currentEditingSectionId = ref<number>()
const currentEditingContentId = useModel<number | null>("editingContent")

function onNewContentInSection(payload: any, sectionIndex: number) {
  emits("new-content-in-section", {
    ...payload,
    sectionIndex,
  })
}

async function sendNewContentOrder(newSectionIndex: number, payload: any) {
  const sectionToRemoveIndex = findSectionToDeleteIndex(
    contentsBySection.value[newSectionIndex].contents[payload.newIndex].section,
    contentsBySection.value
  )
  await updateContentOrder(
    contentsBySection.value[newSectionIndex].contents,
    contentsBySection.value[newSectionIndex].id
  )
  if (!(sectionToRemoveIndex === undefined))
    emits("delete-section", sectionToRemoveIndex)
}

async function sendNewSectionOrder(payload: any) {
  await updateSectionOrder(contentsBySection.value)
  await checkAndMerge(contentsBySection.value, payload.oldIndex)
  await checkAndMerge(contentsBySection.value, payload.newIndex)
  emits("reload-contents")
}

function elementToType(element: HTMLElement) {
  for (const type of ["sections", "solo-contents", "grouped-contents"])
    if (element.classList.contains(type)) return type
}

function findAnonymousNeighbour(sectionIndex: number): {
  found: boolean
  insertFunction?: any
} {
  if (sectionIndex > 0 && !contentsBySection.value[sectionIndex - 1].isFoldable)
    return {
      found: true,
      insertFunction: contentsBySection.value[sectionIndex - 1].contents.push,
    }
  if (
    sectionIndex + 1 < contentsBySection.value.length &&
    !contentsBySection.value[sectionIndex + 1].isFoldable
  )
    return {
      found: true,
      insertFunction: (elt: Content) =>
        contentsBySection.value[sectionIndex + 1].contents.splice(-1, 0, elt),
    }
  return { found: false }
}

async function onAddAmongSections(payload: any) {
  const sectionIndex = payload.newIndex
  const elementType = elementToType(payload.from)

  if (elementType === "section") return

  const content = contentsBySection.value[payload.newIndex] as any as Content
  const whereToInsert = findAnonymousNeighbour(sectionIndex)

  if (whereToInsert.found) {
    whereToInsert.insertFunction(content)
    contentsBySection.value.splice(sectionIndex, 1)
    return sendNewSectionOrder(payload)
  }
  return emits("new-adhoc-section", {
    nextIndex: payload.newIndex,
  })
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

ul
  list-style: none
  padding: 0
</style>
