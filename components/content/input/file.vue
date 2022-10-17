<template>
  <DsfrInput
    v-model="content.title"
    hint="max 50 caractères"
    maxlength="50"
    :label-visible="true"
    label="Titre"
    placeholder="Titre"
  />
  <DsfrInput
    v-model="content.annotation"
    :is-textarea="true"
    :label-visible="true"
    label="Légende"
    placeholder="Légende"
    maxlength="280"
  />
  <div v-if="content.file?.link" class="fr-mt-2w">
    <a
      :href="content.file?.link"
      class="no-underline no-append-ico"
      rel="noopener noreferrer"
      target="_blank"
    >
      <VIcon name="ri-file-line" />
      {{ content.file?.name }}
    </a>
  </div>
  <FormFileUpload
    :id="inputId"
    v-model="content.value.file"
    label="Remplacer le fichier"
  />
  <DsfrCheckbox
    v-if="isImage"
    v-model="content.withPreview"
    label="Afficher l'aperçu de l'image"
    name="preview"
  />
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { FileContent } from "~/composables/types"
import { useModel } from "~/composables/modelWrapper"

defineProps({
  modelValue: { type: Object as PropType<FileContent>, required: true },
})

const content = useModel<FileContent>("modelValue", { type: "object" })

const inputId = computed(() => `file-input-${content.value.id}`)

const isImage = computed<boolean>(
  () => content.value.file?.mimeType?.includes("image") || false
)
</script>
