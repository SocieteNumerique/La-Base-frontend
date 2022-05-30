<template>
  <div>
    <div v-if="content.withPreview" class="file-preview"><!-- TODO --></div>
    <div v-if="!content.withPreview || isEditingView">
      {{ content.file.name }}
    </div>
    <a :href="content.file.link">{{ content.file.name }}</a>
    <div v-if="!isEditingView">
      <div class="fr-btns-group--xs">
        <a :href="content.file.link">
          <button class="fr-btn--tertiary-no-outline">Télécharger</button>
        </a>
        <button class="fr-btn--tertiary-no-outline" disabled>Visualiser</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FileContent } from "~/composables/types"
import { PropType } from "vue"

defineProps({
  content: { type: Object as PropType<FileContent>, required: true },
  isEditingView: { type: Boolean, default: true },
})
</script>

<style lang="sass" scoped></style>
