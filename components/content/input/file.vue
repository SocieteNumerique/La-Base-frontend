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
  <DsfrFileUpload
    :id="inputId"
    ref="inputContainer"
    :hint="hint"
    label="Remplacer le fichier"
    @change="onChange"
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
import { inputToFileObject } from "~/composables/fileUpload"

defineProps({
  modelValue: { type: Object as PropType<FileContent>, required: true },
})

const content = useModel<FileContent>("modelValue", { type: "object" })
const hint = "Taille maximale de fichier : 15 Mo."

const inputContainer = ref()
const inputId = computed(() => `file-input-${content.value.id}`)
const fileInput = ref<HTMLInputElement>()
onMounted(() => {
  fileInput.value = inputContainer.value.$el.getElementsByTagName("input")[0]
})

const isImage = computed<boolean>(
  () => content.value.file?.mimeType?.includes("image") || false
)

async function onChange() {
  const fileObject = await inputToFileObject(fileInput.value!)
  content.value.file = fileObject!
}
</script>
