<template>
  <slot>
    <DsfrFileUpload
      ref="inputContainer"
      :error="error"
      :hint="hint"
      :label="label"
      :accept="requireImage ? 'image/*' : '*'"
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
})

const file = useModel<FullFile>("modelValue", { type: "object" })
const hint = `Taille maximale : ${props.maxSize}.`
const error = ref<string>("")

const inputContainer = ref()
const fileInput = ref<HTMLInputElement>()
onMounted(() => {
  fileInput.value = inputContainer.value.$el.getElementsByTagName("input")[0]
})

const isImage = computed<boolean>(
  () => file.value?.mimeType?.includes("image") || false
)

async function onChange() {
  error.value = ""
  const fileObject = await inputToFileObject(fileInput.value!)
  file.value = fileObject!
  if (props.requireImage && fileObject) {
    if (!isImage.value) error.value = "Le fichier uploadé n'est pas une image"
  }
}
</script>
