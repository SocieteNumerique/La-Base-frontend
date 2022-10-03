<template>
  <div :class="{ overlay: overlay, 'no-image': !url }" class="image-container">
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

const props = defineProps({
  resizableImage: { type: Object as PropType<ResizableImage>, default: null },
  circle: {
    type: Boolean,
    default: false,
  },
  ratio: { type: Number, default: 1 },
  width: {
    type: [Number, String] as PropType<"small" | "medium" | "large" | number>,
    default: "medium",
  },
  bordered: { type: Boolean, default: true },
  defaultImage: {
    type: String as PropType<"" | "resource" | "collection" | "base">,
    default: "",
  },
  overlay: { type: Boolean, default: false },
})

const diameters = {
  small: 30,
  medium: 100,
  large: 144,
}

const url = computed<string>(() => {
  if (props.resizableImage) return props.resizableImage.image?.link || ""
  return ""
})

const widthPx = computed<number>(() =>
  typeof props.width === "number" ? props.width : diameters[props.width]
)
const heightPx = computed<number>(() => widthPx.value / props.ratio)

const defaultImageStyle = computed(() => {
  return {
    width: `${widthPx.value}px`,
    height: `${heightPx.value}px`,
    border: props.bordered ? "1px solid #E5E5E5" : undefined,
    "border-radius": props.circle ? "100%" : undefined,
  }
})

const style = computed(() => {
  const size =
    props.resizableImage?.scaleX && props.resizableImage?.scaleY
      ? `${widthPx.value * (props.resizableImage.scaleX || 1)}px ${
          heightPx.value * (props.resizableImage.scaleY || 1)
        }px`
      : "cover"

  const positionX = props.resizableImage?.relativePositionX
    ? `-${props.resizableImage.relativePositionX * widthPx.value}px`
    : "left"
  const positionY = props.resizableImage?.relativePositionY
    ? `-${props.resizableImage.relativePositionY * heightPx.value}px`
    : "top"
  return {
    "background-image": url.value
      ? `url('${url.value}')`
      : "var(--background-default-grey)",
    width: `${widthPx.value}px`,
    height: `${heightPx.value}px`,

    "background-position-x": positionX,
    "background-position-y": positionY,
    "background-size": size,
    "border-radius": props.circle ? "50%" : undefined,
    border: props.bordered ? "1px solid #E5E5E5" : undefined,
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
    background-color: change-color(#E3E3FD, $alpha: 0.33)
  &.no-image::after
    background-color: change-color(#ede8ff, $alpha: 0.35)
</style>
