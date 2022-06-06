<template>
  <div class="content-type-selector" @focusout="isMenuShown = false">
    <button
      class="fr-btn fr-btn--tertiary fr-btn--sm"
      @click="isMenuShown = !isMenuShown"
    >
      <VIcon name="ri-add-circle-line" />
      <span>
        <slot>Ajouter un contenu</slot>
      </span>
    </button>
    <div v-show="isMenuShown" class="selector__menu fr-px-2w">
      <div class="item" @mousedown="onNewFileContent">Fichier</div>
      <div class="item" @mousedown="addSimpleContent('link')">Lien</div>
      <div class="item" @mousedown="addSimpleContent('text')">Texte</div>
      <div class="item" @mousedown="addSimpleContent('linkedResource')">
        Ressource liée
      </div>
    </div>
    <input
      id="file"
      ref="fileInput"
      class="input-file"
      type="file"
      @change="onAddFile"
    />
  </div>
</template>

<script lang="ts" setup>
import { inputToFileObject } from "~/composables/fileUpload"

const emits = defineEmits(["new-content"])
const fileInput = ref<HTMLInputElement>()
const isMenuShown = ref<boolean>(false)

function onNewFileContent() {
  fileInput.value!.click()
}

async function onAddFile() {
  const fileObject = await inputToFileObject(fileInput.value!)
  emits("new-content", {
    type: "file",
    file: fileObject,
  })
}

function addSimpleContent(type: string) {
  return emits("new-content", { type })
}
</script>

<style lang="sass" scoped>
.content-type-selector
  background-color: white
  border-color: var(--background-open-blue-france)
  //position: relative
  .selector__menu
    //position: absolute
    background-color: white
    z-index: 10
    width: 170px
    box-shadow: 0 16px 16px -16px rgba(0, 0, 0, 0.32), 0 8px 16px rgba(0, 0, 0, 0.1)
    border-top: 2px solid var(--background-action-high-blue-france)
    .item
      border-bottom: 1px solid var(--border-default-grey)
      padding: 12px 0
      cursor: pointer

  .input-file
    display: none
</style>
