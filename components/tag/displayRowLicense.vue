<template>
  <div class="license-tag-rows is-flex">
    <DsfrTags :tags="tags" :small="small" />
    <span v-if="licenseText?.name">
      {{ licenseText.name }}
    </span>
    <a
      v-if="licenseText?.link"
      :href="licenseText?.link"
      rel="noopener noreferrer"
      target="_blank"
      class="no-underline no-append-ico"
    >
      <button>
        <VIcon name="ri-external-link-line" scale="0.67" />
      </button>
    </a>
    <a
      v-if="licenseText?.file"
      :href="licenseText?.file.link"
      rel="noopener noreferrer"
      target="_blank"
      class="no-underline no-append-ico"
    >
      <button><VIcon name="ri-file-text-line" scale="0.67" /></button>
    </a>
  </div>
</template>

<script setup lang="ts">
import { LicenseText } from "~/composables/types"
import { PropType } from "vue"

defineProps({
  licenseText: {
    type: Object as PropType<LicenseText>,
    default: () => ({}),
  },
  tags: {
    type: Array as PropType<{ label: string }[]>,
    default: () => [],
  },
  small: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="sass">
.license-tag-rows
  align-items: center
  span, a
    padding-top: 4px
    padding-bottom: 4px
    margin-bottom: 0.5rem
    margin-right: 0.5rem
</style>
