<template>
  <component :is="props.tagName" :style="{ 'grid-column': `span ${nbCol}` }">
    <div class="fr-grid-row space-between">
      <div>
        <div class="type-icon" />
        <button disabled>edit title</button>
        <span>
          {{ content.title }}
        </span>
      </div>
      <div>
        <button @click="$emit('delete')">delete</button>
        <button disabled>params</button>
      </div>
    </div>

    <div class="vue"></div>

    <div class="fr-grid-row space-between">
      <button disabled>légender</button>
      <button draggable="true" @drag="resizeOverlay" @dragstart="beginDrag">
        resize
        <div ref="resizeGhostImage" />
      </button>
    </div>
  </component>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Content } from "~/composables/types"
import { useModel } from "~/composables/modelWrapper"

const props = defineProps({
  modelValue: { type: Object as PropType<Content>, required: true },
  tagName: { type: String, default: "div" },
})
defineEmits(["delete"])

const content = useModel<Content>("modelValue", { type: "object" })
const resizeGhostImage = ref<HTMLElement>()
// drag and dropo resize

const nbCol = computed<number>(() => content.value.nbCol) // TODO computed
const dragging = ref<boolean>(false)

function beginDrag(event: DragEvent) {
  event.dataTransfer.setDragImage(resizeGhostImage.value, 0, 0)
  dragging.value = true
  return false
  // TODO show preview size overlay
}

function resizeOverlay() {
  //  TODO
}

function endDrag() {
  dragging.value = false
  // TODO hide preview size overlay
}
</script>

<style lang="sass">
.space-between
  justify-content: space-between

.vue
  background-color: blue
  height: 100px
  position: relative
</style>
