<template>
  <div>
    <p>
      {{ evaluationStore.currentCriterion.description }}
    </p>
    <DsfrRadioButtonSet
      v-model="evaluationStore.evaluation.evaluation"
      name="recommendation-is-positive"
      :options="options"
      required
      legend="Recommandez-vous la ressource ?"
    />
    <DsfrInputGroup
      v-model="evaluationStore.evaluation.comment"
      :required="true"
      :is-textarea="true"
      label="Commentaire"
      :label-visible="true"
      hint="Écrivez au minimum 30 caractères"
    />
  </div>
</template>

<script setup lang="ts">
import { useEvaluationStore } from "~/stores/evaluationStore"
import { DsfrInputGroup } from "@gouvminint/vue-dsfr"

const options = [
  { label: "Oui", value: "1" },
  { label: "Non", value: "0" },
]
const evaluationStore = useEvaluationStore()
</script>
