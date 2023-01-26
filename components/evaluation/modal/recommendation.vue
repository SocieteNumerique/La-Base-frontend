<template>
  <div>
    <p>
      Voici une petite légende de quelques caractères afin de présenter
      rapidement mon fichier mais l’idée c’est que ça ne soit pas trop trop
      long, il s’agit d’une légende et non d’un roman, l’outil texte est à dispo
      pour ça.
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
