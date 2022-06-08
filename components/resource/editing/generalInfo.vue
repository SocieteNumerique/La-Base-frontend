<template>
  <div style="display: flex; align-items: baseline">
    <h2 class="fr-h6">Informations générales</h2>
  </div>

  <DsfrInput
    :model-value="resourceStore.current?.title"
    label="Nom de la ressource"
    maxlength="100"
    hint="max 100 caractères"
    :label-visible="true"
    @update:model-value="onTitleUpdate"
  />
  <div class="fr-mt-3w"></div>
  <DsfrInput
    :model-value="resourceStore.current?.description"
    label="Description courte de la ressource"
    hint="max 560 caractères"
    :label-visible="true"
    :is-textarea="true"
    @update:model-value="onDescriptionUpdate"
  />
  <div class="fr-mt-3w"></div>
  <DsfrInput
    :model-value="resourceStore.current?.resourceCreatedOn"
    label="Date de création de la ressource"
    type="date"
    :label-visible="true"
    @update:model-value="onDateUpdate"
  />
  <div class="fr-mt-3w"></div>
  <h3>Image de couverture</h3>
  <div v-if="resourceStore.current?.coverImage?.link">
    <div>
      <img
        style="max-width: 100%; max-height: 350px"
        :alt="resourceStore.current?.coverImage?.name"
        :src="resourceStore.current?.coverImage?.link"
      />
    </div>
    <label for="imageCoverInput">Modifier l'image</label>
  </div>
  <div v-else>
    <label for="imageCoverInput">
      <template v-if="resourceStore.current?.coverImage">
        ✓ image ajoutée, sauvegardez la ressource pour l'afficher
      </template>
      <template v-else>
        Ajouter une image de couverture Formats supportés : jpg, png, gif
      </template>
    </label>
  </div>
  <input
    id="imageCoverInput"
    ref="fileInput"
    class="input-file"
    type="file"
    accept="image/*"
    @change="onAddFile"
  />
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { inputToFileObject } from "~/composables/fileUpload"

const resourceStore = useResourceStore()

const fileInput = ref<HTMLInputElement>()

const onTitleUpdate = (value: string) => {
  resourceStore.current.title = value
  resourceStore.markDirty()
}

const onDescriptionUpdate = (value: string) => {
  resourceStore.current.description = value
  resourceStore.markDirty()
}

const onDateUpdate = (value: string) => {
  resourceStore.current.resourceCreatedOn = value
}

const onAddFile = async () => {
  resourceStore.resourcesById[resourceStore.currentId!].coverImage =
    await inputToFileObject(fileInput.value!)
}
</script>
