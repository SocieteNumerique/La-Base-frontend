<template>
  <div>
    <DsfrCallout
      title="Attention"
      content="Ce changement - une fois sauvegardé - est définitif. Les utilisateurs n'ayant pas accès à la base à laquelle vous transférer l'administration n'auront plus accès à l'édition de cette ressource."
    />
    <BaseSelector
      v-model="selectedBase"
      label="Base à laquelle cette ressource est rattachée"
      @change="onBaseUpdate"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue"
import { useResourceStore } from "~/stores/resourceStore"
import { DsfrCallout } from "@laruiss/vue-dsfr"
import UserSelector from "~/components/userSelector.vue"

const resourceStore = useResourceStore()

const selectedBase = ref<undefined | number>()

const onBaseUpdate = () => {
  resourceStore.resourcesById[resourceStore.currentId!].rootBase =
    selectedBase.value
}

onMounted(() => {
  selectedBase.value = resourceStore.current.rootBase
})
</script>
