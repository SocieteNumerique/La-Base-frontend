<template>
  <div class="is-flex has-children-space-between flex-center">
    <FileUpload
      v-model="file.image"
      require-image
      :max-size="maxSize"
      :label="label"
      @update:model-value="file = { image: $event }"
    />
    <ImageProfileRound :resizable-image="file" size="medium" />
  </div>
  <DsfrButton
    v-if="file.image?.link && !showResizeModal"
    class="fr-my-3v"
    @click="showResizeModal = true"
  >
    Ouvrir l'outil de recadrage
  </DsfrButton>
  <div v-if="showResizeModal">
    <client-only>
      <Cropper
        ref="cropper"
        class="cropper"
        :src="file.image.link"
        :stencil-component="stencilComponent"
        :stencil-props="stencilProps"
        :default-position="defaultPosition"
        :default-size="defaultSize"
        background-class="cropper-background"
        @change="file.coordinates = $event.coordinates"
      />
    </client-only>
    <DsfrButton
      v-if="file.image && showResizeModal"
      class="fr-my-3v"
      secondary
      @click="showResizeModal = false"
    >
      Annuler le recadrage
    </DsfrButton>
  </div>
</template>

<script lang="ts" setup>
import { Component, PropType } from "vue"
import { ResizableImage } from "~/composables/types"
import {
  Cropper,
  CircleStencil,
  RectangleStencil,
  Size,
  Coordinates,
} from "vue-advanced-cropper"
import "vue-advanced-cropper/dist/style.css"

const props = defineProps({
  modelValue: { type: Object as PropType<ResizableImage>, required: true },
  label: { type: String, default: "Ajouter un fichier" },
  maxSize: { type: String, default: "15 Mo" },
  cropCircle: {
    type: Boolean,
    default: false,
  },
  desiredRatio: { type: Number, default: null },
})
const emits = defineEmits(["update:modelValue"])

const file = computed<ResizableImage>({
  get() {
    if (!props["modelValue"]) return { image: undefined }
    return props["modelValue"]
  },
  set(value) {
    emits(`update:modelValue`, { ...value })
  },
})
const cropper = ref()
const showResizeModal = ref<boolean>(false)
const stencilProps = computed(() => ({
  aspectRatio: props.desiredRatio,
}))
const stencilComponent = computed<Component>(() =>
  props.cropCircle ? CircleStencil : RectangleStencil
)

function defaultPosition({ imageSize }: { imageSize: Size }) {
  return {
    left: Math.round(
      ((file.value.relativePositionX || 0) * imageSize.width) /
        (file.value.scaleX || 1)
    ),
    top: Math.round(
      ((file.value.relativePositionY || 0) * imageSize.height) /
        (file.value.scaleY || 1)
    ),
  }
}

function defaultSize({
  imageSize,
  visibleArea,
}: {
  imageSize: Size
  visibleArea: Coordinates
}) {
  return {
    width: Math.round(
      imageSize.width / (file.value.scaleX || 1) ||
        (visibleArea || imageSize).width
    ),
    height: Math.round(
      imageSize.height / (file.value.scaleY || 1) ||
        (visibleArea || imageSize).height
    ),
  }
}
</script>

<style lang="sass">
.cropper
  max-height: 60vh
  margin: 12px auto
.cropper-background
  background: white
</style>
