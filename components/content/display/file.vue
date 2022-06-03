<template>
  <div>
    <div v-if="content.withPreview && isImage" class="file-preview">
      <img :alt="content.file.name" :src="imageLink" />
    </div>
    <div v-if="isEditingView">
      <a :href="content.file.link" rel="noopener noreferrer" target="_blank">
        <VIcon name="ri-file-line" />
        {{ content.file.name }}
      </a>
    </div>
    <div v-else-if="!content.withPreview || !isImage" class="file-no-preview">
      <VIcon name="ri-file-line" />
      {{ content.file.name }}
    </div>
    <div v-if="!isEditingView">
      <div class="fr-btns-group--xs">
        <a :download="content.file.name" :href="content.file.link">
          <button class="fr-btn--tertiary-no-outline">Télécharger</button>
        </a>
        <a :href="content.file.link" rel="noopener noreferrer" target="_blank">
          <button class="fr-btn--tertiary-no-outline">Ouvrir</button>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FileContent } from "~/composables/types"
import { PropType } from "vue"

const props = defineProps({
  content: { type: Object as PropType<FileContent>, required: true },
  isEditingView: { type: Boolean, default: true },
})

const isImage = computed<boolean>(
  () => props.content.file?.mimeType?.includes("image") || false
)

const imageLink = computed<string | undefined>(() => {
  if (isImage.value && props.content.withPreview) return props.content.file.link
})
</script>

<style lang="sass" scoped>
a
  text-decoration: none !important

  &::after
    content: none !important

.file-preview img
  max-width: 100%
  max-height: 350px
</style>
