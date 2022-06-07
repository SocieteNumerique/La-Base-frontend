<template>
  <div>
    <h1 class="fr-mt-4w">Accueil</h1>
    <h2 class="fr-mt-5w">Mes bases</h2>
    <div class="is-flex fr-mb-4w">
      <BaseMiniature
        v-for="baseId of baseStore.basesOrder"
        :key="baseId"
        :base="baseStore.basesById[baseId]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBaseStore } from "~/stores/baseStore"

const baseStore = useBaseStore()
</script>
