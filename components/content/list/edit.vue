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
      class="sections fr-my-4w"
      handle=".section-drag-handle"
      item-key="id"
      tag="ul"
      @add="onAddAmongSections"
      @update="sendNewSectionOrder"
    >
      <template #item="{ element: section, index: sectionIndex }">
        <div class="section-container fr-pb-4w">
          <div
            :class="section.isFoldable ? 'foldable-section' : ''"
            class="section"
          >
            <template v-if="section.isFoldable">
              <div v-if="showToolbarSection" class="toolbar-section">
                <button
                  class="section-drag-handle"
                  style="position: relative; right: 14px"
                >
                  <img src="~/assets/svg/dragHandle.svg" />
                </button>
                <div>
                  <button
                    class="btn-tab-activable fr-btn--tertiary-no-outline fr-mr-2w"
                    @click="currentEditingSectionId = section.id"
                  >
                    <VIcon name="ri-edit-line" />
                    Éditer
                  </button>
                  <ContentButtonDeleteSection
                    @delete-section="$emit('delete-section', sectionIndex)"
                  />
                </div>
              </div>
              <ContentInputSection
                v-if="currentEditingSectionId === section.id || section.isNew"
                v-model="contentsBySection[sectionIndex]"
                @exit="noLongerEditing(section)"
              />
              <div v-else class="header-section">
                <h3>{{ section.title }}</h3>
                <button
                  class="fr-btn--tertiary-no-outline"
                  @click="
                    isSectionFoldedById[section.id] =
                      !isSectionFoldedById[section.id]
                  "
                >
                  <span v-show="!isSectionFoldedById[section.id]">
                    <VIcon name="ri-arrow-up-s-line" /> Fermer
                  </span>
                  <span v-show="isSectionFoldedById[section.id]">
                    <VIcon name="ri-arrow-down-s-line" /> Ouvrir
                  </span>
                </button>
              </div>
            </template>
            <div
              :class="isSectionFoldedById[section.id] ? '-folded' : ''"
              class="hide-if-folded"
            >
              <draggable
                v-model="contentsBySection[sectionIndex].contents"
                :animation="100"
                :class="
                  section.isFoldable ? 'grouped-contents' : 'solo-contents'
                "
                :group="draggableContentsGroup(section.isFoldable)"
                handle=".content-drag-handle"
                item-key="id"
                tag="ul"
                @add="sendNewContentOrder(sectionIndex, $event)"
                @update="sendNewContentOrder(sectionIndex, $event)"
              >
                <template #item="{ element: content, index: contentIndex }">
                  <li>
                    <ContentListItemEdit
                      v-model="
                        contentsBySection[sectionIndex].contents[contentIndex]
                      "
                      :is-editing="currentEditingContentId === content.id"
                      class="content-in-section"
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
          </div>
        </div>
      </template>
    </draggable>
    <div
      class="fr-btns-group fr-btns-group--inline"
      style="align-items: flex-start"
    >
      <ContentInputChooseType
        @new-content="$emit('new-solo-content', $event)"
      />
      <IntroTooltip slug="ADD_CONTENT_SECTION">
        <button
          class="fr-btn fr-btn--tertiary fr-btn--sm fr-px-2v fr-m-0"
          @click="$emit('new-section', 'Nouvelle section')"
        >
          <img class="fr-mr-2v" src="~/assets/svg/sectionIcon.svg" width="20" />
          <!-- <VIcon class="fr-mr-2v" name="ri-folder-add-line" /> -->
          Créer une section
        </button>
      </IntroTooltip>
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
  editingContent: { type: Number, default: null },
})
const emits = defineEmits([
  "new-solo-content",
  "delete-content",
  "new-section",
  "new-content-in-section",
  "delete-section",
  "auto-delete-section",
  "new-adhoc-section",
  "update:editingContent",
  "update:modelValue",
  "reload-contents",
])

const draggableContentsGroup = computed(() => (isFoldable: boolean) => {
  return {
    name: isFoldable ? "groupedContents" : "soloContents",
    pull: ["groupedContents", "sections", "soloContents"],
    put: ["groupedContents", "soloContents"],
  }
})

const showToolbarSection = ref(true)

const contentsBySection = useModel<SectionWithContent[]>("modelValue", {
  type: "array",
})
const currentEditingSectionId = ref<number>()
const currentEditingContentId = useModel<number | null>("editingContent")
const isSectionFoldedById = ref<{ [key: number]: boolean }>({})

onMounted(() => {
  for (const section of contentsBySection.value) {
    isSectionFoldedById.value[section.id] = false
  }
})

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
    emits("auto-delete-section", sectionToRemoveIndex)
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
  if (
    sectionIndex > 0 &&
    !contentsBySection.value[sectionIndex - 1]?.isFoldable
  )
    return {
      found: true,
      insertFunction: (elt: Content) => {
        contentsBySection.value[sectionIndex - 1].contents.push(elt)
      },
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

function noLongerEditing(section: SectionWithContent) {
  section.isNew = false
  currentEditingSectionId.value = null
}
</script>

<style lang="sass" scoped>
.section-drag-handle
  cursor: move
  cursor: -webkit-grabbing

ul
  list-style: none
  padding: 0

li:not(:last-child) .content-in-section, .section-container:not(:last-child)
  border-bottom: 1px solid var(--border-default-grey)

li:not(:last-child) .content-in-section
  padding-bottom: 16px

.section-container
  &.is-editing, &:hover
    .toolbar-section
      opacity: 1

  .toolbar-section
    opacity: 0
</style>
