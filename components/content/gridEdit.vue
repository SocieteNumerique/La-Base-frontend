<template>
  <div>
    <h2 class="title is-2">Grille</h2>
    Ajouter :
    <div class="fr-grid-row">
      <button>Un lien</button>
      <button>Un fichier</button>
      <button @click="addTextContent">Un texte</button>
    </div>
    <DsfrCheckbox
      v-model="isGridEnabled"
      label="Activer la vue en grille"
      name="grid-enabled"
    />
    {{ message }}
    <div class="grid-container fr-m-n2v">
      <div ref="gridUnderlayRef" class="grid grid-underlay">
        <div v-for="index in 6" :key="index" class="grid-block" />
      </div>
      <ul v-if="props.enabled" ref="blockGridRef" class="grid content-grid">
        <ContentGridItemEdit
          v-for="(_, index) of contents"
          :key="index"
          v-model="contents[index]"
          :message="message"
          tag-name="li"
          @dragend="onDrop($event, contents[index])"
          @dragstart="onDragBegin($event, index)"
        />
        <li><button @click="addTextContent">+</button></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Content } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"

const props = defineProps({
  modelValue: { type: Array as PropType<Content[]>, default: () => [] },
  enabled: { type: Boolean, default: false },
})

const contents = useModel<Content[]>("modelValue", { type: "array" })
const isGridEnabled = useModel("enabled")

function addContent(content: Content): void {
  contents.value.push(content)
}

function addTextContent(): void {
  const textContent = { type: "text", text: "", nbCol: 3 }
  addContent(textContent)
}

// Drag and drop resize
const gridUnderlayRef = ref<HTMLElement>()
const blockGridRef = ref<HTMLElement>()
const gridColumnWidth = computed<number | undefined>(
  () => gridUnderlayRef?.value?.getBoundingClientRect().width / 6 || undefined
) // TODO watch window resize
const message = ref("")
const targetColumnIndex = ref<number>(-1)
const initColumnIndex = ref<number>(-1)
const onGrid = computed<boolean>(
  () => targetColumnIndex.value < 6 && targetColumnIndex.value >= 0
)

function columnIndexFromX(xPosition: number): number {
  if (!gridColumnWidth.value || !gridUnderlayRef.value)
    throw "Layout not setup yet"
  const distFromBegin =
    xPosition - gridUnderlayRef.value.getBoundingClientRect().x
  return Math.floor(distFromBegin / gridColumnWidth.value)
}

function startColumnIndex(element: HTMLElement): number {
  return columnIndexFromX(element.clientLeft)
}

function isInTheEnd(elementIndex: number): boolean {
  if (!gridUnderlayRef.value) throw "Layout not setup yet"
  if (!blockGridRef.value) throw "Layout not setup yet"
  const element = blockGridRef.value.children.item(elementIndex)
  if (!element) throw "Layout not setup yet"
  const distFromBegin =
    element.clientLeft +
    element.clientWidth -
    gridUnderlayRef.value.clientLeft -
    gridUnderlayRef.value.clientWidth
  return distFromBegin === 0
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
  const xPosition = blockGridRef.value.children
    .item(index)
    .getBoundingClientRect().x
  initColumnIndex.value = columnIndexFromX(xPosition)
}

function onDrag(event: DragEvent) {
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

function onDrop(event: DragEvent, content: Content) {
  if (!gridUnderlayRef.value) throw "Layout not setup yet"
  for (let colElement of gridUnderlayRef.value.children) {
    colElement.classList.toggle("targeted", false)
  }
  // TODO resize content
  const nbCol = targetColumnIndex.value - initColumnIndex.value + 1
  if (nbCol <= 0) return // TODO message
  content.nbCol = nbCol
}

window.addEventListener("dragover", onDrag)
</script>

<style lang="sass" scoped>
.grid-container
  position: relative
  height: min-content
  .grid
    height: 100%
    width: 100%
    display: grid
    grid-gap: 8px
    grid-template-columns: repeat(6, 1fr)
    z-index: -1
    &.grid-underlay
      position: absolute
    .grid-block
      background-color: antiquewhite
      height: 100%
      &.targeted
        background-color: tan
  .content-grid
    list-style-type: none
    padding: 0
    margin: 0
    li
      padding: 0
</style>
