<template>
  <div
    :class="{ overlay: overlay, 'no-image': !url }"
    class="image-container"
    :style="!url && overlay ? 'background: white' : null"
  >
    <div v-if="resizableImage" :style="style" class="resized-image" />
    <div v-else-if="defaultImage">
      <img
        :src="`/img/defaultImage/${defaultImage}.png`"
        alt=""
        :style="defaultImageStyle"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { ResizableImage } from "~/composables/types"

type Dimensions = { width: string; height: string }

const props = defineProps({
  resizableImage: { type: Object as PropType<ResizableImage>, default: null },
  circle: { type: Boolean, default: false },
  format: { type: String, required: true },
  dimensions: {
    type: Object as PropType<Dimensions>,
    default: null,
  },
  bordered: { type: Boolean, default: true },
  defaultImage: {
    type: String as PropType<"" | "resource" | "collection" | "base">,
    default: "",
  },
  overlay: { type: Boolean, default: false },
})

const diameters: { [key: string]: Dimensions } = {
  option: { width: "30px", height: "30px" },
  miniature: { width: "100px", height: "100px" },
  index: { width: "144px", height: "144px" },
}

const url = computed<string>(() =>
  props.resizableImage
    ? props.resizableImage?.croppedImage?.links?.[props.format] ||
      props.resizableImage?.image?.link ||
      ""
    : ""
)

const computedDimensions = computed<Dimensions>(
  () =>
    props.dimensions ||
    diameters[props.format] || { width: "100px", height: "100px" }
)

const defaultImageStyle = computed(() => {
  return {
    border: props.bordered ? "1px solid #E5E5E5" : undefined,
    "border-radius": props.circle ? "100%" : undefined,
    width: computedDimensions.value.width,
    height: computedDimensions.value.height,
  }
})

const style = computed(() => {
  return {
    "background-image": url.value
      ? `url('${url.value}')`
      : "var(--background-default-grey)",
    "border-radius": props.circle ? "50%" : undefined,
    border: props.bordered ? "1px solid #E5E5E5" : undefined,
    "background-color": "white",
    width: computedDimensions.value.width,
    height: computedDimensions.value.height,
  }
})
</script>

<style lang="sass" scoped>
.image-container
  overflow: hidden
/* Frame 1017 */
.resized-image
  box-sizing: border-box
  flex-shrink: 0

  /* light/background/contrast-info */
  border: 0.847059px solid #E8EDFF
  background-position: top
  background-size: cover


.overlay
  position: relative

  &::after
    content: ""
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 5
    background-color: change-color(#E3E3FD, $alpha: 0.25)

  &.no-image::after
    background-color: change-color(#ede8ff, $alpha: 0.35)
</style>
