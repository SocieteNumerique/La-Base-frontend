<template>
  <div>
    <DsfrHighlight
      text="Attention : ce changement - une fois sauvegardé - est définitif. Les utilisateurs n'ayant pas accès à la base à laquelle vous transférez l'administration n'auront plus accès à l'édition de cette fiche ressource."
    />
    <BaseSelector
      v-model="selectedBase"
      label="Base administratrice de la fiche ressource"
      @change="onBaseUpdate"
    />
    <h3 class="fr-text--md fr-text--regular fr-mt-5w">
      Transférer l’administration de la ressource
    </h3>
    <DsfrHighlight
      text="Les droits d’administration de la fiche  peuvent être demandés directement via la fiche par d’autres utilisateurs. Vous recevrez alors un mail avec un lien et pourrez confirmer ou non le transfert des droits d’administration."
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue"
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()

const selectedBase = ref<undefined | number>()

const onBaseUpdate = () => {
  resourceStore.resourcesById[resourceStore.currentId!].rootBase =
    selectedBase.value
  resourceStore.markDirty()
}

onMounted(() => {
  selectedBase.value = resourceStore.current.rootBase
})
</script>
