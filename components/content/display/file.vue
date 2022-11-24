<template>
  <div>
    <div v-if="content.withPreview && isImage" class="file-preview">
      <img alt="" :src="imageLink" crossorigin />
    </div>
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
    <div
      v-else-if="!content.withPreview || !isImage"
      class="file-no-preview fr-text-xs"
    >
      <VIcon name="ri-file-line" scale="0.8" class="fr-mr-1w" />{{
        content.file?.name
      }}
    </div>
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
        <a
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
  </div>
</template>

<script lang="ts" setup>
import { FileContent } from "~/composables/types"
import { PropType } from "vue"
import { useAlertStore } from "~/stores/alertStore"

const props = defineProps({
  content: { type: Object as PropType<FileContent>, required: true },
  isEditingView: { type: Boolean, default: true },
  isGridView: { type: Boolean, default: false },
})

const isImage = computed<boolean>(
  () => props.content.file?.mimeType?.includes("image") || false
)

const imageLink = computed<string | undefined>(() => {
  if (isImage.value && props.content.withPreview)
    return props.content.file?.link
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
