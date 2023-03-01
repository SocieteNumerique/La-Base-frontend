<template>
  <div>
    <DsfrToggleSwitch
      v-model="canEvaluate"
      label="Activer les évaluations"
      hint="Les visiteurs de la fiche peuvent publier des évaluations. Si vous désactivez les évaluations, celles qui ont été déjà été publiées n’apparaitrons plus mais pourront être réactivées"
      @change="onCanEvaluateUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useResourceStore } from "~/stores/resourceStore"
import { DsfrToggleSwitch } from "@gouvminint/vue-dsfr"

const resourceStore = useResourceStore()

const canEvaluate = ref(true)

const onCanEvaluateUpdate = () => {
  resourceStore.resourcesById[resourceStore.currentId!].canEvaluate =
    canEvaluate.value
  resourceStore.markDirty()
}

onMounted(() => {
  canEvaluate.value = resourceStore.current.canEvaluate
})
</script>
