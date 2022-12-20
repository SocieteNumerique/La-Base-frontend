<template>
  <div class="base-label">
    <div
      style="display: flex; align-items: center; max-width: 340px"
      class="fr-text--xs fr-pr-2w"
    >
      <div>
        <ImageResized
          :resizable-image="base.profileImage"
          format="option"
          circle
          class="fr-mr-2v"
          default-image="base"
        />
      </div>
      <slot>
        {{ base.title }}
      </slot>
    </div>
    <div class="admin-or-contributor">
      {{ base.canWrite ? "Administrateur" : "Contributeur" }}
    </div>
  </div>
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
  justify-content: space-between
  width: 100%
.admin-or-contributor
  color: #929292
  font-size: 10px
</style>
