<template>
  <span class="base-label">
    <ImageResized
      :resizable-image="base.profileImage"
      width="small"
      circle
      class="fr-mr-2v"
    />
    <slot>
      {{ base.title }}
    </slot>
  </span>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { FullFile } from "~/composables/types"

defineProps({
  base: {
    type: Object as PropType<{
      id: number
      title: string
      profileImage?: FullFile
    }>,
    required: true,
  },
})
</script>

<style lang="sass" scoped>
.base-label
  display: flex
  align-items: center
</style>
