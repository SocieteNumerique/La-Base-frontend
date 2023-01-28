<template>
  <div>
    <h2>Évaluations</h2>
    <p>
      Définition de ce que c’est pour nous que l’évaluation, bonnes pratiques
    </p>
    <div v-if="isReady">
      <div v-for="criterion of evaluationStore.criteria" :key="criterion.slug">
        <hr />
        <div class="fr-grid-row">
          <div class="fr-col-md-6 fr-pr-8w">
            <h3 class="fr-text--lg fr-text--regular fr-mb-4w">
              {{ criterion.name }}
            </h3>
            <p class="fr-text--sm">
              {{ criterion.description }}
            </p>
          </div>
          <div class="fr-col-md-6">
            <EvaluationSummary
              :grades="evaluationsPerCriterion[criterion.slug]?.stats.grades"
              :evaluations="
                evaluationsPerCriterion[criterion.slug]?.evaluations
              "
              :criterion="criterion"
              @refresh="refresh"
              @evaluate="emit('evaluate', criterion.slug)"
              @recommend="emit('recommend', criterion.slug)"
              @not-recommend="emit('not-recommend', criterion.slug)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEvaluationStore } from "~/stores/evaluationStore"
import { useResourceStore } from "~/stores/resourceStore"
import { onMounted } from "vue"
import { EvaluationForCriterion } from "~/composables/types"

const evaluationStore = useEvaluationStore()
const resourceStore = useResourceStore()
const evaluationsPerCriterion = ref<Record<string, EvaluationForCriterion>>({})
const isReady = ref(false)

const emit = defineEmits(["recommend", "not-recommend", "evaluate"])
onMounted(async () => {
  await refresh()
})
const refresh = async () => {
  evaluationsPerCriterion.value = await evaluationStore.getEvaluations(
    resourceStore.currentId!
  )
  isReady.value = true
}
</script>
