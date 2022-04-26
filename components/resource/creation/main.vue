<template>
  <div>
    <div v-if="resourceStore.creationStep == 'publish_as'">
      <template v-if="baseStore.hasBases">
        <h6>Je publie une fiche ressource en tant que</h6>
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
                      :disabled="!selectedBase">Continuer
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
  </div>
</template>

<script lang="ts" setup>
import {useResourceStore} from "~/stores/resourceStore";
import {useBaseStore} from "~/stores/baseStore";

const resourceStore = useResourceStore()
const baseStore = useBaseStore()

const selectedBase = ref<number | null>(null)

const selectBase = () => {
  resourceStore.new.baseId = selectedBase.value
  resourceStore.incrementCreationStep()
}
</script>

<style scoped>

</style>
