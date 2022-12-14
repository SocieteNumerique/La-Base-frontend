<template>
  <div
    :class="section.isFoldable ? 'foldable-section' : ''"
    class="fr-mb-6w section"
  >
    <template v-if="section.isFoldable">
      <div class="toolbar-section">
        <div>
          <button
            class="fr-btn--tertiary-no-outline"
            @click="$emit('swap-one', -1)"
          >
            ←
          </button>
          <button
            class="fr-btn--tertiary-no-outline"
            @click="$emit('swap-one', 1)"
          >
            →
          </button>
        </div>
        <div>
          <button
            class="btn-tab-activable fr-btn--tertiary-no-outline fr-mr-2w"
            @click="isEditing = true"
          >
            <VIcon name="ri-edit-line" />
            Éditer
          </button>
          <button
            class="fr-btn--tertiary-no-outline"
            @click="$emit('delete-section')"
          >
            <VIcon name="ri-delete-bin-line" />
            Supprimer
          </button>
        </div>
      </div>
      <div class="header-section">
        <h3>{{ section.title }}</h3>
        <DsfrModal :opened="isEditing" title="" @close="isEditing = false">
          <ContentInputSection v-model="section" @exit="isEditing = false" />
        </DsfrModal>
        <button
          class="fr-btn--tertiary-no-outline"
          @click="isFolded = !isFolded"
        >
          <span v-show="!isFolded">
            <VIcon name="ri-arrow-up-s-line" /> Fermer
          </span>
          <span v-show="isFolded">
            <VIcon name="ri-arrow-down-s-line" /> Ouvrir
          </span>
        </button>
      </div>
    </template>
    <div
      :class="isFolded ? '-folded' : ''"
      class="grid-container hide-if-folded"
    >
      <div ref="gridUnderlayRef" class="grid grid-underlay">
        <div v-for="index in 6" :key="index" class="grid-block" />
      </div>
      <ul ref="blockGridRef" class="grid content-grid">
        <ContentGridItemEdit
          v-for="(content, index) of contents"
          :key="index"
          v-model="contents[index]"
          :is-editing="currentEditingContentId === content.id"
          :message="message"
          class="content-item with-white-border-top"
          tag-name="li"
          @delete="onDelete(contents[index].id, index)"
          @dragend="onDrop($event, index)"
          @dragstart="onDragBegin($event, index)"
          @swap-one="swapOne(index, $event)"
          @open-edition="currentEditingContentId = content.id"
          @exit-edition="currentEditingContentId = undefined"
        />
        <li
          :style="{ 'grid-column': `span 2` }"
          class="fr-pt-3w with-white-border-top"
        >
          <ContentInputChooseType @new-content="$emit('new-content', $event)">
            Ajouter un contenu
            <template v-if="section.isFoldable">
              à {{ section.title }}
            </template>
          </ContentInputChooseType>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Content, SectionWithContent } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"
import {
  orderSwap,
  updateContent,
  updateContentOrder,
} from "~/composables/contentsHelper"

defineProps({
  modelValue: { type: Object as PropType<SectionWithContent>, required: true },
  editingContent: { type: Number, default: undefined },
})

const emits = defineEmits([
  "new-content",
  "new-content-in-section",
  "delete-section",
  "auto-delete-section",
  "delete-content",
  "swap-one",
  "update:editing-content",
])

const section = useModel<SectionWithContent>("modelValue", { type: "object" })
const currentEditingContentId = useModel<number | null>("editingContent")
const isFolded = ref<boolean>(false)
const isEditing = ref<boolean>(false)

const contents = computed<Content[]>({
  get() {
    return section.value.contents
  },
  set(newValue) {
    section.value.contents = newValue
  },
})

async function swapOne(index: number, direction: number) {
  // TODO allow to leave non-foldable section
  orderSwap(contents.value, index, direction)
  return updateContentOrder(contents.value, section.value.id)
}

async function onDelete(id: number, index: number) {
  if (section.value.isFoldable && !section.value.contents.length)
    return emits("auto-delete-section")
  return emits("delete-content", { id, index })
}

// Drag and drop resize -------------------------------

const gridUnderlayRef = ref<HTMLElement>()
const blockGridRef = ref<HTMLElement>()
const gridColumnWidth = computed<number | undefined>(
  () => gridUnderlayRef.value!.getBoundingClientRect().width / 6 || undefined
) // TODO watch window resize
const message = ref("")
const targetColumnIndex = ref<number>(-1)
const initColumnIndex = ref<number>(-1)
const isDragging = ref<boolean>(false)

// computes the size of the block at drop
// making sure it is between 1 and 6
function nextNbCol(): number {
  if (targetColumnIndex.value >= 6)
    // if we drop with the mouse on the right of the grid
    // make the element one column bigger than the space left on the line
    return Math.min(6, 6 - initColumnIndex.value + 1)
  // normal situation
  return Math.max(2, targetColumnIndex.value - initColumnIndex.value + 1)
}

function rawColumnIndexFromX(xPosition: number): number {
  if (!gridColumnWidth.value || !gridUnderlayRef.value)
    throw "Layout not setup yet"
  const distFromBegin =
    xPosition - gridUnderlayRef.value.getBoundingClientRect().x
  return Math.floor(distFromBegin / gridColumnWidth.value)
}

function applyOnUnderlayColumns(
  start: number,
  end: number,
  func: (colElement: Element) => void
) {
  if (!gridUnderlayRef.value) throw "Layout not setup yet"
  let element
  for (let i = Math.max(0, start); i <= Math.min(end, 5); i++) {
    element = gridUnderlayRef.value.children.item(i)
    if (element) func(element)
  }
}

function onDragBegin(event: DragEventInit, index: number) {
  isDragging.value = true
  const xPosition = blockGridRef!
    .value!.children!.item(index)!
    .getBoundingClientRect().x
  initColumnIndex.value = rawColumnIndexFromX(xPosition)
}

function onDrag(event: DragEvent) {
  // onDrag will be called if anything is dragged
  // this test ensures it is a resizing drag
  if (!isDragging.value) return

  targetColumnIndex.value = Math.max(
    initColumnIndex.value + 1,
    rawColumnIndexFromX(event.clientX)
  )
  applyOnUnderlayColumns(
    initColumnIndex.value,
    targetColumnIndex.value,
    (colElement) => {
      colElement.classList.toggle("targeted", true)
    }
  )
  applyOnUnderlayColumns(targetColumnIndex.value + 1, 5, (colElement) => {
    colElement.classList.toggle("targeted", false)
  })
  // TODO message if too left
  // TODO message if too right and blocked
  // TODO message if too right and not blocked
}

async function onDrop(event: DragEvent, contentIndex: number) {
  const content = contents.value[contentIndex]
  isDragging.value = false
  if (!gridUnderlayRef.value) throw "Layout not setup yet"
  for (let colElement of gridUnderlayRef.value.children) {
    colElement.classList.toggle("targeted", false)
  }
  const nbCol = nextNbCol()
  if (nbCol <= 0 || nbCol === content.nbCol) return // TODO message
  content.nbCol = nbCol
  const updatedContent = await updateContent(content, false)
  if (!updatedContent) return
  contents.value[contentIndex] = updatedContent
}

if (!process.server) window.addEventListener("dragover", onDrag)
</script>

<style>
.content-item p:not(.fr-tag):last-child {
  margin-bottom: 0 !important;
}
</style>

<style lang="sass" scoped>
.grid-container
  position: relative
  height: min-content
  overflow-x: hidden
  overflow-y: visible

  .grid
    height: 100%
    width: 100%
    display: grid
    grid-gap: 24px
    row-gap: 12px
    grid-template-columns: repeat(6, 1fr)
    z-index: -1

    &.grid-underlay
      position: absolute

    .grid-block
      background-color: var(--background-alt-grey)
      height: 100%

      &.targeted
        background-color: var(--background-alt-blue-france)

  .content-grid
    list-style-type: none
    padding: 0
    margin: 0

    li.content-item
      padding: 30px 8px 8px
      text-overflow: ellipsis
      overflow-wrap: break-word
      max-width: 100%

    .with-white-border-top
      position: relative

      &:before
        position: absolute
        content: " "
        top: 0
        left: 0
        height: 24px
        width: 1000px
        background: white
</style>
