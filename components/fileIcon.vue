<template>
  <div style="line-height: 0">
    <VIcon
      v-if="isRemix"
      :name="path"
      aria-hidden="true"
      scale="2.64"
      color="black"
    />
    <img v-else :src="path" alt="" style="width: 50px" />
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
