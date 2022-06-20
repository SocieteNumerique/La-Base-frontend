<template>
  <component
    :is="props.tagName"
    :class="{ 'is-editing': isEditing }"
    :style="{ 'grid-column': `span ${nbCol}` }"
    class="content-container"
  >
    <div class="toolbar fr-text--xs">
      <div class="fr-btns-group--xs">
        <button
          class="btn-tab-activable fr-btn--tertiary-no-outline"
          @click="$emit('swap-one', -1)"
        >
          <VIcon :scale="0.85" name="ri-arrow-left-s-line" />
        </button>
        <button
          class="btn-tab-activable fr-btn--tertiary-no-outline"
          @click="$emit('swap-one', 1)"
        >
          <VIcon :scale="0.85" name="ri-arrow-right-s-line" />
        </button>
      </div>
      <div class="fr-btns-group--xs">
        <button
          class="btn-tab-activable fr-btn--tertiary-no-outline"
          @click="$emit('open-edition')"
        >
          <VIcon :scale="0.85" name="ri-edit-line" />
        </button>
        <button class="fr-btn--tertiary-no-outline" disabled>
          <VIcon :scale="0.85" name="ri-settings-3-line" />
        </button>
        <button class="fr-btn--tertiary-no-outline" @click="$emit('delete')">
          <VIcon :scale="0.85" name="ri-delete-bin-line" />
        </button>
      </div>
    </div>

    <ContentDisplay
      v-show="!isEditing"
      :content="content"
      :is-editing-view="true"
    />
    <DsfrModal :opened="isEditing" @close="$emit('exit-edition')">
      <ContentInput v-model="content" @exit="$emit('exit-edition')" />
    </DsfrModal>

    <div class="footer">
      <button draggable="true" @drag="resizeOverlay" @dragstart="beginDrag">
        <VIcon class="resize-image" name="ri-arrow-right-down-line" />
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
  isEditing: { type: Boolean, default: false },
})
defineEmits(["delete", "swap-one", "exit-edition", "open-edition"])

const content = useModel<Content>("modelValue", { type: "object" })
const resizeGhostImage = ref<HTMLElement>()
// drag and drop resize

const nbCol = computed<number>(() => content.value.nbCol) // TODO computed
const dragging = ref<boolean>(false)

function beginDrag(event: DragEvent) {
  event.dataTransfer!.setDragImage(resizeGhostImage.value!, 0, 0)
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
.content-container
  .footer
    display: flex
    justify-content: right
    border-bottom: 2px solid transparent

  &:hover .footer
    border-bottom: 2px solid var(--border-action-high-blue-france)

  .resize-image
    color: #000091
    opacity: 0

  &:hover .resize-image
    opacity: 1
</style>
