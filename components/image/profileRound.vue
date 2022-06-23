<template>
  <div :style="style" class="profile-image" />
</template>

<script lang="ts" setup>
import { PropType } from "vue"

const props = defineProps({
  imageUrl: { type: String, default: "" },
  size: {
    type: String as PropType<"small" | "medium" | "large">,
    default: "medium",
  },
})

const diameters = {
  small: "30px",
  medium: "100px",
  large: "144px",
}

const style = {
  background: props.imageUrl
    ? `url('${props.imageUrl}')`
    : "var(--background-default-grey)",
  "--diameter": diameters[props.size],
}
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
</style>
