<template>
  <div class="is-flex has-children-space-between flex-center">
    <FormFileUpload
      v-model="file.image"
      require-image
      :max-size="maxSize"
      :label="label"
      :hint="hint"
      @update:model-value="file = { image: $event }"
    />
    <ImageResized
      :resizable-image="file"
      format="preview"
      :dimensions="{
        width: '100px',
        height: `${Math.round(100 / desiredRatio)}px`,
      }"
      :bordered="false"
      :circle="cropCircle"
    />
  </div>
  <div class="fr-btns-group fr-btns-group--inline">
    <DsfrButton
      v-if="file.image?.link && !showResizeModal"
      class="fr-my-3v"
      @click="showResizeModal = true"
    >
      Ouvrir l'outil de recadrage
    </DsfrButton>
    <DsfrButton
      v-if="file.image && !showResizeModal"
      class="fr-my-3v"
      secondary
      @click="file = null"
    >
      Retirer l'image
    </DsfrButton>
  </div>
  <div v-if="showResizeModal">
    <client-only>
      <Cropper
        ref="cropper"
        class="cropper"
        :canvas="false"
        :src="file.image.link"
        :stencil-component="stencilComponent"
        :stencil-props="stencilProps"
        :default-position="defaultPosition"
        :default-size="defaultSize"
        background-class="cropper-background"
        @change="updateCoordinates"
      />
    </client-only>
    <DsfrButton
      v-if="file.image && showResizeModal"
      class="fr-my-3v"
      @click="confirm"
    >
      OK
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
  CropperResult,
} from "vue-advanced-cropper"
import "vue-advanced-cropper/dist/style.css"
import { useAlertStore } from "~/stores/alertStore"

const props = defineProps({
  modelValue: { type: Object as PropType<ResizableImage>, required: true },
  label: { type: String, default: "Ajouter un fichier" },
  maxSize: { type: String, default: "15 Mo" },
  cropCircle: {
    type: Boolean,
    default: false,
  },
  desiredRatio: { type: Number, default: null },
  hint: { type: String, default: "" },
  imageQualifier: { type: String, default: "" },
})
const emits = defineEmits(["update:modelValue"])

const file = computed<ResizableImage>({
  get() {
    if (!props["modelValue"]) return { image: undefined }
    return props["modelValue"]
  },
  set(value) {
    emits(`update:modelValue`, value === null ? null : { ...value })
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

const confirm = () => {
  showResizeModal.value = false
  useAlertStore().alert(
    "Le recadrage sera pris en compte une fois l'objet enregistré"
  )
}

function defaultPosition({ imageSize }: { imageSize: Size }) {
  return {
    left: Math.round((file.value.relativeLeft || 0) * imageSize.width),
    top: Math.round((file.value.relativeTop || 0) * imageSize.height),
  }
}

function defaultSize({
  imageSize,
}: {
  imageSize: Size
  visibleArea: Coordinates
}) {
  return {
    width: Math.round(imageSize.width * (file.value.relativeWidth || 1)),
    height: Math.round(imageSize.height * (file.value.relativeHeight || 1)),
  }
}

function updateCoordinates({ coordinates, image }: CropperResult) {
  file.value = {
    ...file.value,
    relativeWidth: coordinates.width / image.width,
    relativeHeight: coordinates.height / image.height,
    relativeLeft: coordinates.left / image.width,
    relativeTop: coordinates.top / image.height,
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
