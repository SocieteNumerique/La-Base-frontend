<template>
  <div>
    <h2>Évaluations</h2>
    <p>
      Définition de ce que c’est pour nous que l’évaluation, bonnes pratiques
    </p>
    <div v-for="criterion of evaluationStore.criteria" :key="criterion.slug">
      <hr />
      <div class="fr-grid-row">
        <div class="fr-col-md-6">
          <h3 class="fr-text--lg fr-text--regular fr-mb-4w">
            {{ criterion.name }}
          </h3>
          <p class="fr-text--sm">
            {{ criterion.description }}
          </p>
        </div>
        <div class="fr-col-md-6"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEvaluationStore } from "~/stores/evaluationStore"
import { useResourceStore } from "~/stores/resourceStore"

const evaluationStore = useEvaluationStore()
const resourceStore = useResourceStore()
</script>
