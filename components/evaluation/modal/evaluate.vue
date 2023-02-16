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
  { label: "Très forte", value: "4" },
  { label: "Forte", value: "3" },
  { label: "Moyenne", value: "2" },
  { label: "Faible", value: "1" },
  { label: "Très faible", value: "0" },
]
const evaluationStore = useEvaluationStore()
</script>
