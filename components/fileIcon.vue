<template>
  <div>
    <VIcon v-if="isRemix" :name="path" aria-hidden="true" />
    <img :src="path" alt="" />
  </div>
</template>
<script setup lang="ts">
import {
  fileExtensionToMediaType,
  mediaTypeToSvgPath,
} from "~/composables/constants"

const props = defineProps({
  extension: { type: String, required: true },
})

const mediaType = fileExtensionToMediaType[props.extension]
let path = mediaTypeToSvgPath[mediaType]
const isRemix = path.startsWith("remix:")
if (isRemix) {
  path = path.replace("remix:", "")
}
</script>
