<template>
  <DsfrInputGroup
    v-model="content.title"
    :hint="`${getLengthOrZero(content.title)} / 50 caractères`"
    maxlength="50"
    :label-visible="true"
    label="Titre"
    placeholder="Titre"
  />
  <DsfrInputGroup
    v-model="content.annotation"
    :is-textarea="true"
    :label-visible="true"
    label="Légende"
    placeholder="Légende"
    :hint="`${getLengthOrZero(content.annotation)} / 280 caractères`"
    maxlength="280"
  />
  <DsfrInput
    v-if="isImage"
    v-model="content.imageAlt"
    :label-visible="true"
    label="Texte alternatif de l'image"
    :hint="`Texte descriptif pour les non-voyants, ${
      (content.imageAlt || '').length
    }/100 caractères ; laisser vide pour une image purement décorative`"
    placeholder="Texte alternatif"
    maxlength="100"
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
    v-model="content.file"
    label="Remplacer le fichier"
  />
  <DsfrCheckbox
    v-if="isImage"
    v-model="content.withPreview"
    label="Afficher l'aperçu de l'image"
    name="preview"
    class="fr-checkbox-group--sm"
  />
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { FileContent } from "~/composables/types"
import { useModel } from "~/composables/modelWrapper"
import { getLengthOrZero } from "~/composables/utils"

defineProps({
  modelValue: { type: Object as PropType<FileContent>, required: true },
})

const content = useModel<FileContent>("modelValue", { type: "object" })

const inputId = computed(() => `file-input-${content.value.id}`)

const isImage = computed<boolean>(
  () => content.value.file?.mimeType?.includes("image") || false
)
</script>
