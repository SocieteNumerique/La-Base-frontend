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
