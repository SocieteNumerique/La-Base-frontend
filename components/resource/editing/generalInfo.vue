<template>
  <div style="display: flex; align-items: baseline">
    <h2 class="fr-h6">Informations générales</h2>
    <p
      v-if="resourceStore.isCreating && resourceStore.creationStepIndex < 2"
      class="fr-text--xs fr-ml-2w"
    >
      Requis
    </p>
  </div>

  <DsfrInput
    :model-value="resourceStore.newParams.title"
    label="Nom de la ressource"
    :label-visible="true"
    @update:modelValue="onTitleUpdate"
  />
  <div class="fr-mt-3w"></div>
  <DsfrInput
    :model-value="resourceStore.newParams.description"
    label="Description courte de la ressource"
    :hint="'Super long texte explicatif'"
    :label-visible="true"
    :is-textarea="true"
    @update:modelValue="onDescriptionUpdate"
  />

  <div class="fr-mt-3w" style="display: flex; align-items: baseline">
    <h2 class="fr-h6 fr-mb-1w">Contenu</h2>
    <p class="fr-text--xs fr-ml-2w fr-mb-1w">Requis, 1 minimum</p>
  </div>
  <p class="fr-text--bold fr-mb-1w">ajout rapide</p>
  <p class="fr-text--xs">
    Ces contenus peuvent être ajoutés maintenant ou plus tard.
  </p>

  <ContentGridItemEdit
    v-for="(content, contentIx) in resourceStore.newParams.contents"
    :key="contentIx"
    :value="content"
  />

  <DsfrButton icon="ri-add-circle-line" @click="addContent"
    >Ajouter un contenu</DsfrButton
  >

  <div style="text-align: right">
    <DsfrButton :disabled="isCreateResourceDisabled" @click="createResource"
      >Créer la fiche ressource</DsfrButton
    >
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { computed } from "vue"

const resourceStore = useResourceStore()

const onTitleUpdate = (value: string) => {
  resourceStore.newParams.title = value
}

const onDescriptionUpdate = (value: string) => {
  resourceStore.newParams.description = value
}

const addContent = () => {
  resourceStore.newParams.contents.push({
    type: "text",
    title: "blalba",
    nbCol: 3,
  })
}

// TODO: create in backend
const createResource = () => {
  resourceStore.incrementCreationStep()
}

const isCreateResourceDisabled = computed(() => {
  if (
    !resourceStore.newParams.title ||
    resourceStore.newParams.title.length < 3
  ) {
    return true
  }

  if (
    !resourceStore.newParams.description ||
    resourceStore.newParams.description.length < 10
  ) {
    return true
  }

  // TODO check there is at least one content
  if (
    !resourceStore.newParams.contents ||
    resourceStore.newParams.contents.length < 0
  ) {
    return true
  }

  console.log("### can create resource")
  return false
})
</script>

<style scoped></style>
