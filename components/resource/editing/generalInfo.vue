<template>
  <div style="display: flex; align-items: baseline">
    <h2 class="fr-h6">Informations générales</h2>
  </div>

  <DsfrInput
    :model-value="resourceStore.current.title"
    label="Nom de la ressource"
    :label-visible="true"
    @update:model-value="onTitleUpdate"
  />
  <div class="fr-mt-3w"></div>
  <DsfrInput
    :model-value="resourceStore.current.description"
    label="Description courte de la ressource"
    :hint="'Super long texte explicatif'"
    :label-visible="true"
    :is-textarea="true"
    @update:model-value="onDescriptionUpdate"
  />
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { useRouter } from "vue-router"

const resourceStore = useResourceStore()
const router = useRouter()

const onTitleUpdate = (value: string) => {
  resourceStore.current.title = value
}

const onDescriptionUpdate = (value: string) => {
  resourceStore.current.description = value
}
</script>

<style scoped></style>
