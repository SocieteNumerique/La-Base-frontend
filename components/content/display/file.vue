<template>
  <div>
    <!-- IMAGE PREVIEW -->
    <div v-if="content.withPreview && isImage" class="file-preview">
      <img
        :alt="content.imageAlt ? content.imageAlt : ''"
        :src="imageLink"
        crossorigin
      />
    </div>

    <!-- EDIT VIEW -->
    <div v-if="isEditingView">
      <a
        :href="content.file?.link"
        class="no-underline no-append-ico fr-text--xs"
        rel="noopener noreferrer"
        target="_blank"
      >
        <VIcon name="ri-file-line" scale="0.8" class="fr-mr-1w" />{{
          content.file?.name
        }}
      </a>
    </div>

    <!-- DISPLAY VIEW -->
    <div
      v-else-if="!content.withPreview || !isImage"
      class="file-no-preview fr-text-xs"
      style="display: flex; align-items: center"
    >
      <FileIcon
        v-if="isRecognizedFileExtension"
        :extension="fileExtension"
        class="fr-mr-2w"
      />
      <VIcon v-else name="ri-file-line" scale="0.8" class="fr-mr-1w" />{{
        content.file?.name
      }}
    </div>

    <!-- ACTIONS (open, download) -->
    <div v-if="!isEditingView">
      <div class="fr-btns-group--xs">
        <button
          class="fr-btn--tertiary-no-outline fr-py-1v fr-px-2w"
          @click="download"
        >
          <VIcon :scale="0.8" class="fr-mr-2v" name="ri-download-line" />
          <span v-if="!isGridView">Télécharger</span>
        </button>
        <a
          ref="blobElement"
          :download="content.file?.name"
          :href="blob"
          rel="noopener noreferrer"
        />
        <button
          v-if="fileExtension === '.pdf' || isImage"
          class="fr-btn--tertiary-no-outline fr-py-1v fr-px-2w"
          @click="showPreviewModal = true"
        >
          <VIcon :scale="0.8" class="fr-mr-2v" name="ri-eye-line" />
          <span v-if="!isGridView">Ouvrir</span>
        </button>
        <a
          v-else
          :href="content.file?.link"
          class="no-underline no-append-ico"
          rel="noopener noreferrer"
          target="_blank"
        >
          <button class="fr-btn--tertiary-no-outline fr-py-1v fr-px-2w">
            <VIcon :scale="0.8" class="fr-mr-2v" name="ri-eye-line" />
            <span v-if="!isGridView">Ouvrir</span>
          </button>
        </a>
      </div>
    </div>
    <DsfrModal
      v-if="showPreviewModal"
      :opened="true"
      :title="content.title"
      class="modal-1200"
      @close="showPreviewModal = false"
    >
      <div v-if="isImage" style="text-align: center">
        <img
          :alt="content.imageAlt ? content.imageAlt : ''"
          :src="imageLink"
          crossorigin
          style="max-width: 100%; max-height: 500px"
        />
      </div>
      <embed
        v-else
        style="min-height: 600px"
        :src="content.file?.link"
        type="application/pdf"
        frameBorder="0"
        scrolling="auto"
        height="100%"
        width="100%"
      />
    </DsfrModal>
  </div>
</template>

<script lang="ts" setup>
import { FileContent } from "~/composables/types"
import { PropType } from "vue"
import { useAlertStore } from "~/stores/alertStore"
import { fileExtensionToMediaType } from "~/composables/constants"
import DsfrModal from "~/components/DsfrResizableModal.vue"

const props = defineProps({
  content: { type: Object as PropType<FileContent>, required: true },
  isEditingView: { type: Boolean, default: true },
  isGridView: { type: Boolean, default: false },
})
const showPreviewModal = ref(false)

const isImage = computed<boolean>(
  () => props.content.file?.mimeType?.includes("image") || false
)

const imageLink = computed<string | undefined>(() => {
  if (isImage.value) return props.content.file?.link
})
const fileExtension = computed<string>(() => {
  const name = props.content.file?.name
  if (!name) {
    return ""
  }
  const split = name.split(".")
  if (split.length < 2) {
    return ""
  }
  return "." + split[split.length - 1]
})
const isRecognizedFileExtension = computed<boolean>(() => {
  return !!fileExtensionToMediaType[fileExtension.value]
})

const blob = ref<string>()
const blobElement = ref<HTMLLinkElement>()

async function download() {
  if (process.server) return
  if (!props.content.file?.link)
    return useAlertStore().alert("Une erreur est survenue", "", "error")
  const blobResponse = await $fetch<Blob>(props.content.file.link, {
    responseType: "blob",
  })
  blob.value = window.URL.createObjectURL(new Blob([blobResponse]))
  await nextTick()
  console.log({ url: blob.value, inElement: blobElement.value!.href })
  blobElement.value!.click()
}
</script>

<style lang="sass" scoped>
.file-preview img
  max-width: 100%
  max-height: 350px
</style>

<style>
.modal-1200 .fr-grid-row > * {
  max-width: 1200px;
  width: 95%;
  flex: 0 0 95%;
}
</style>
