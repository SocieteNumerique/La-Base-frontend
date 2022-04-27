<template>
  <div>
    <div v-if="resourceStore.creationStep == 'publish_as'">
      <template v-if="baseStore.hasBases">
        <h2 class="fr-h6">Je publie une fiche ressource en tant que</h2>
        <DsfrSelect
            :required="true"
            :label="'Choisissez une base'"
            :options="baseStore.baseOptions"
            :description="'La ressource créée sera rattachée à cette base'"
            v-model="selectedBase"
        />

        <div style="text-align: right">
          <DsfrButton @click="selectBase()"
                      icon="ri-arrow-right-s-line"
                      :icon-right="true"
                      :disabled="!selectedBase">Informations générales
          </DsfrButton>
        </div>
      </template>
      <template v-else>
        <p>
          Vous n'êtes propriétaire ou éditeur d'aucune base. Pour ajouter une ressource, vous devez d'abord
        </p>
        <p>
          <RouterLink to="/base/new" class="fr-btn">Créer une base</RouterLink>
        </p>
      </template>

    </div>

    <div v-else-if="resourceStore.creationStep == 'init_general_info'">
      <div style="display: flex; align-items: baseline;">
        <h2 class="fr-h6">Informations générales</h2>
        <p class="fr-text--xs fr-ml-2w">Requis</p>
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
      <p class="fr-text--xs">Ces contenus peuvent être ajoutés maintenant ou plus tard.</p>

      <ContentGridItemEdit
          v-for="(content, contentIx) in resourceStore.newParams.contents"
          :key="contentIx"
          :value="content"/>

      <DsfrButton @click="addContent" icon="ri-add-circle-line">Ajouter un contenu</DsfrButton>

      <div style="text-align: right">
        <DsfrButton :disabled="isCreateResourceDisabled">Créer la fiche ressource</DsfrButton>
      </div>

      <div class="fr-mt-4w">
        <pre>{{ resourceStore.newParams.title }}</pre>
        <pre>{{ resourceStore.newParams.description }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useResourceStore} from "~/stores/resourceStore";
import {useBaseStore} from "~/stores/baseStore";
import {computed, ref} from "vue";

const resourceStore = useResourceStore()
const baseStore = useBaseStore()

const selectedBase = ref<number | undefined>(undefined)

const selectBase = () => {
  resourceStore.newParams.rootBaseId = selectedBase.value
  resourceStore.incrementCreationStep()
}

const onTitleUpdate = (value: string) => {
  resourceStore.newParams.title = value
}

const onDescriptionUpdate = (value: string) => {
  resourceStore.newParams.description = value
}

const addContent = () => {
  resourceStore.newParams.contents.push({type: "text", title: "blalba", nbCol: 3})
}

const isCreateResourceDisabled = computed(() => {
  if (!resourceStore.newParams.title
      || (resourceStore.newParams.title.length < 3)) {
    return true
  }

  if (!resourceStore.newParams.description
      || (resourceStore.newParams.description.length < 10)) {
    return true
  }

  if (!resourceStore.newParams.contents
      || (resourceStore.newParams.contents.length < 1)) {
    return true
  }

  console.log("### can create resource")
  return false
})
</script>

<style scoped>

</style>
