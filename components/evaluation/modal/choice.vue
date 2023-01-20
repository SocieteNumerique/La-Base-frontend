<template>
  <div>
    <DsfrCheckboxSet
      v-model="evaluationStore.selectedCriteriaInput"
      legend="Choisissez les critères que vous souhaitez évaluer"
      :options="resultsAsCheckboxOptions"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import { DsfrCheckboxSet } from "@gouvminint/vue-dsfr"
import { computed } from "vue"
import { useEvaluationStore } from "~/stores/evaluationStore"

const evaluationStore = useEvaluationStore()

const resultsAsCheckboxOptions = computed<
  { label: string; id: string; name: string }[]
>(() => [
  { label: "Tous les critères", id: "all", name: "all" },
  { label: "Recommandation", id: "recommend", name: "recommend" },
  ...evaluationStore.criteria.map((criterion) => {
    return { label: criterion.name, id: criterion.slug, name: criterion.slug }
  }),
])

// listen for clicks on "Select all criteria"
const onInput = ($event: any) => {
  if ($event.target.name === "all") {
    console.log("### on click all")
    if (
      Object.values(evaluationStore.selectedCriteriaInput).indexOf("all") === -1
    ) {
      // select all
      evaluationStore.selectedCriteriaInput = [
        "all",
        "recommend",
        ...evaluationStore.criteria.map((criterion) => criterion.slug),
      ]
    } else {
      // unselect all
      evaluationStore.selectedCriteriaInput = []
    }
  }
}
</script>
