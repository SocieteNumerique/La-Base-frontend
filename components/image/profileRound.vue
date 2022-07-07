<template>
  <div :style="style" class="profile-image" />
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { ResizableImage } from "~/composables/types"

const props = defineProps({
  resizableImage: { type: Object as PropType<ResizableImage>, default: null },
  size: {
    type: String as PropType<"small" | "medium" | "large">,
    default: "medium",
  },
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

const style = computed(() => {
  const size =
    props.resizableImage?.scaleX && props.resizableImage?.scaleY
      ? `${100 * (props.resizableImage.scaleX || 1)}% ${
          100 * (props.resizableImage.scaleY || 1)
        }%`
      : "cover"

  const positionX = props.resizableImage?.relativePositionX
    ? `left -${
        props.resizableImage.relativePositionX * diameters[props.size]
      }px`
    : "left"
  const positionY = props.resizableImage?.relativePositionY
    ? `top -${props.resizableImage.relativePositionY * diameters[props.size]}px`
    : "top"
  return {
    "background-image": url.value
      ? `url('${url.value}')`
      : "var(--background-default-grey)",
    "--diameter": `${diameters[props.size]}px`,
    "background-position-x": positionX,
    "background-position-y": positionY,
    "background-size": size,
  }
})
</script>

<style lang="sass" scoped>
/* Frame 1017 */
.profile-image
  box-sizing: border-box
  width: var(--diameter)
  height: var(--diameter)

  /* light/background/contrast-info */
  border: 0.847059px solid #E8EDFF
  border-radius: 847.059px
  background-position: top
  background-size: cover
</style>
