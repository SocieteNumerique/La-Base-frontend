<template>
  <div>
    <div v-if="true || resourceStore.creationStepIndex < 2">
      <h4 class="fr-text-title--blue-france">Pour commencer </h4>
      <div class="fr-text--xs">Nous avons besoin de quelques informations essentielles pour créer la ressource.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useResourceStore} from "~/stores/resourceStore";

const resourceStore = useResourceStore()
</script>
