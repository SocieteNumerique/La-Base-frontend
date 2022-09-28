<template>
  <div class="form-with-margins">
    <div style="display: flex; align-items: baseline">
      <h2 class="fr-h6">Informations générales</h2>
    </div>
    <p>Vous pouvez ré-éditer ces informations à tout moment.</p>

    <DsfrInputGroup
      :model-value="resourceStore.current?.title"
      label="Nom de la ressource"
      maxlength="100"
      hint="Requis - 100 caractères maximum"
      :label-visible="true"
      @update:model-value="onTitleUpdate"
    />

    <DsfrInput
      :model-value="resourceStore.current?.description"
      label-visible
      :is-textarea="true"
      class="fr-mb-3w"
      rows="5"
      @update:model-value="onDescriptionUpdate"
    >
      <template #label>
        Description courte de la ressource
        <span class="fr-hint-text">
          Requis
          <br />
          Décrivez en quelques mots votre ressource (nature, objectifs...).
          Cette description apparaîtra aussi dans les résultats du moteur de
          recherche.
        </span>
      </template>
    </DsfrInput>

    <DsfrInput
      :model-value="resourceStore.current?.resourceCreatedOn"
      label="Date de production de la ressource"
      type="text"
      hint="Au format mois/année"
      placeholder="MM/AAAA"
      :label-visible="true"
      class="fr-mb-3w"
      @update:model-value="onDateUpdate"
    />

    <ImageResizableUpload
      v-if="resourceStore.current?.profileImage"
      v-model="resourceStore.current.profileImage"
      :label="`${
        resourceStore.current?.profileImage?.image
          ? 'Changer l\''
          : 'Ajouter une '
      }image de miniature`"
      :desired-ratio="1.4"
      hint="Taille maximale : 15 Mo. Formats supportés : jpg, pdf, png."
    />
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()

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
</script>
