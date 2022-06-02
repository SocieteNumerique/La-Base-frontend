<template>
  <div class="fr-mb-6w">
    <template v-if="section.isFoldable">
      <h2 v-if="section.isFoldable">{{ section.title }}</h2>
      <button @click="$emit('swap-one', -1)">←</button>
      <button @click="$emit('swap-one', 1)">→</button>
      <button @click="$emit('delete-section')">delete section</button>
    </template>
    <div class="grid-container">
      <div ref="gridUnderlayRef" class="grid grid-underlay">
        <div v-for="index in 6" :key="index" class="grid-block" />
      </div>
      <ul ref="blockGridRef" class="grid content-grid">
        <ContentGridItemEdit
          v-for="(content, index) of contents"
          :key="index"
          v-model="contents[index]"
          :message="message"
          class="content-item"
          tag-name="li"
          :is-editing="currentEditingContentId === content.id"
          @delete="onDelete(contents[index].id, index)"
          @dragend="onDrop($event, index)"
          @dragstart="onDragBegin($event, index)"
          @swap-one="swapOne(index, $event)"
          @open-edition="currentEditingContentId = content.id"
          @exit-edition="currentEditingContentId = undefined"
        />
        <li v-if="section.isFoldable" :style="{ 'grid-column': `span 2` }">
          <ContentInputChooseType @new-content="$emit('new-content', $event)">
            Ajouter un contenu à {{ section.title }}
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
  "delete-content",
  "swap-one",
  "update:editing-content",
])

const section = useModel<SectionWithContent>("modelValue", { type: "object" })
const currentEditingContentId = useModel<number | null>("editingContent")

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
    return emits("delete-section")
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
function nextNbCol(prevNbCol: number): number {
  if (targetColumnIndex.value >= 6)
    // if we drop with the mouse on the right of the grid
    // make the element one column bigger than the space left on the line
    return Math.min(6, 6 - initColumnIndex.value + 1)
  // normal situation
  return Math.max(1, targetColumnIndex.value - initColumnIndex.value + 1)
}

function columnIndexFromX(xPosition: number): number {
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
  initColumnIndex.value = columnIndexFromX(xPosition)
}

function onDrag(event: DragEvent) {
  // onDrag will be called if anything is dragged
  // this test ensures it is a resizing drag
  if (!isDragging.value) return

  targetColumnIndex.value = columnIndexFromX(event.clientX)
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
  const nbCol = nextNbCol(content.nbCol)
  if (nbCol <= 0 || nbCol === content.nbCol) return // TODO message
  content.nbCol = nbCol
  const updatedContent = await updateContent(content)
  if (!updatedContent) return
  contents.value[contentIndex] = updatedContent
}

window.addEventListener("dragover", onDrag)
</script>

<style>
.content-item p:last-child {
  margin-bottom: 0 !important;
}
</style>

<style lang="sass" scoped>
.grid-container
  position: relative
  height: min-content
  .grid
    height: 100%
    width: 100%
    display: grid
    grid-gap: 24px
    row-gap: 24px
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
      padding: 8px
      text-overflow: ellipsis
      overflow-wrap: break-word
      overflow: hidden
</style>
