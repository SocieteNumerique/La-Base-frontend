<template>
  <slot>
    <DsfrFileUpload
      ref="inputContainer"
      class="fr-form-group"
      :error="error"
      :hint="computedHint"
      :label="label"
      :accept="requireImage ? imageMimeTypes.join(', ') : '*'"
      @change="onChange"
    />
  </slot>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { FullFile } from "~/composables/types"
import { useModel } from "~/composables/modelWrapper"
import { inputToFileObject } from "~/composables/fileUpload"

const props = defineProps({
  modelValue: { type: Object as PropType<FullFile>, required: true },
  label: { type: String, default: "Ajouter un fichier" },
  requireImage: { type: Boolean, default: false },
  maxSize: { type: String, default: "15 Mo" },
  hint: { type: String, default: "" },
})

const file = useModel<FullFile>("modelValue", { type: "object" })
const computedHint = props.hint || `Taille maximale : ${props.maxSize}.`

const inputContainer = ref()
const fileInput = ref<HTMLInputElement>()
onMounted(() => {
  fileInput.value = inputContainer.value.$el.getElementsByTagName("input")[0]
})

const imageMimeTypes = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/mbp",
  "image/tiff",
]

const isImage = computed<boolean>(() => {
  return file.value?.mimeType?.includes("image") || false
})
const touched = ref<boolean>(false)
const error = computed<string>(() =>
  props.requireImage && file.value && !isImage.value && touched.value
    ? "Le fichier uploadé n'est pas une image"
    : ""
)

async function onChange() {
  touched.value = true
  const fileObject = await inputToFileObject(fileInput.value!)
  file.value = fileObject!
}
</script>
