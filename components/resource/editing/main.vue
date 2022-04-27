<template>
  <div>
    <div v-if="resourceStore.creationStep == 'publish_as'">
      <template v-if="baseStore.hasBases">
        <h2 class="fr-h6">Je publie une fiche ressource en tant que</h2>
        <BaseSelector
          v-model="selectedBase"
          description="La ressource créée sera rattachée à cette base"
        />

        <div style="text-align: right">
          <DsfrButton
            icon="ri-arrow-right-s-line"
            :icon-right="true"
            :disabled="!selectedBase"
            @click="selectBase()"
            >Informations générales
          </DsfrButton>
        </div>
      </template>
      <template v-else>
        <p>
          Vous n'êtes propriétaire ou éditeur d'aucune base. Pour ajouter une
          ressource, vous devez d'abord
        </p>
        <p>
          <RouterLink to="/base/new" class="fr-btn">Créer une base</RouterLink>
        </p>
      </template>
    </div>

    <div v-else-if="resourceStore.creationStep == 'init_general_info'">
      <ResourceEditingGeneralInfo />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"
import { useBaseStore } from "~/stores/baseStore"
import { computed, ref } from "vue"
import BaseSelector from "~/components/baseSelector.vue"

const resourceStore = useResourceStore()
const baseStore = useBaseStore()

const selectedBase = ref<number | undefined>(undefined)

const selectBase = () => {
  resourceStore.newParams.rootBaseId = selectedBase.value
  resourceStore.incrementCreationStep()
}
</script>

<style scoped></style>
