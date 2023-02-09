<template>
  <div class="base-label">
    <div
      style="display: flex; max-width: 340px"
      :style="alignTop ? 'align-items: flex-start' : 'align-items: center'"
      class="fr-text--xs fr-mb-0"
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
        <span
          style="color: var(--text-action-high-blue-france)"
          class="underlined-on-hover"
        >
          {{ base.title }}
        </span>
      </slot>
    </div>
    <div v-if="showStatus" class="admin-or-contributor">
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
  showStatus: {
    type: Boolean,
    default: true,
  },
  alignTop: {
    type: Boolean,
    default: false,
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
