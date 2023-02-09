<template>
  <div>
    <p>
      {{ evaluationStore.currentCriterion.description }}
    </p>
    <DsfrRadioButtonSet
      v-model="evaluationStore.evaluation.evaluation"
      name="evaluation-evaluation"
      :options="options"
      required
      legend="Comment évaluez-vous la ressource pour ce critère ?"
    />
    <DsfrInputGroup
      v-model="evaluationStore.evaluation.comment"
      :required="true"
      :is-textarea="true"
      label="Commentaire"
      :label-visible="true"
      placeholder="Écrivez votre commentaire"
    />
  </div>
</template>

<script setup lang="ts">
import { useEvaluationStore } from "~/stores/evaluationStore"

const options = [
  { label: "Très abouti", value: "4" },
  { label: "Abouti", value: "3" },
  { label: "Moyennement abouti", value: "2" },
  { label: "Peu abouti", value: "1" },
  { label: "Pas abouti", value: "0" },
]
const evaluationStore = useEvaluationStore()
</script>
