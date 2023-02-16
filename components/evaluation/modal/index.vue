<template>
  <DsfrModal :opened="true" :title="title" :actions="actions" @close="close">
    <EvaluationModalChoice v-if="evaluationStore.currentStep === 'choice'" />
    <EvaluationModalRecommendation
      v-if="
        evaluationStore.currentStep === 'evaluate' &&
        evaluationStore.currentCriterion?.slug === RECOMMENDATION_CRITERION
      "
    />
    <EvaluationModalEvaluate
      v-if="
        evaluationStore.currentStep === 'evaluate' &&
        evaluationStore.currentCriterion?.slug !== RECOMMENDATION_CRITERION
      "
    />
    <EvaluationModalEvaluateConfirm
      v-if="evaluationStore.currentStep === 'evaluationConfirmation'"
      :evaluation="evaluation"
      @delete="onEvaluationDelete"
    />
  </DsfrModal>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useEvaluationStore } from "~/stores/evaluationStore"
import { Evaluation, EvaluationStep } from "~/composables/types"
import { useResourceStore } from "~/stores/resourceStore"
import { RECOMMENDATION_CRITERION } from "~/composables/constants"

const evaluationStore = useEvaluationStore()
const resourceStore = useResourceStore()
const evaluation = ref<Evaluation>()

const emit = defineEmits(["close"])

const onEvaluationDelete = () => {
  evaluationStore.currentStep = "choice"
  evaluationStore.currentCriterionSlug = ""
}
const actions = computed(() => {
  if (evaluationStore.currentStep === "choice") {
    return [
      {
        label: "Évaluer",
        icon: "ri-arrow-right-line",
        iconRight: true,
        onClick: nextStep,
        disabled: !evaluationStore.selectedCriteria.length,
      },
    ]
  }

  if (evaluationStore.currentStep === "evaluate") {
    return [
      {
        label: "Publier",
        onClick: evaluate,
        disabled:
          evaluationStore.evaluation.evaluation == null ||
          evaluationStore.evaluation.comment.length == 0,
      },
    ]
  }

  if (evaluationStore.currentStep === "evaluationConfirmation") {
    // if there is another criterion, go to this one
    if (
      evaluationStore.selectedCriteria.indexOf(
        evaluationStore.currentCriterionSlug
      ) <
      evaluationStore.selectedCriteria.length - 1
    ) {
      return [
        {
          label: "Critère suivant",
          onClick: nextStep,
        },
        {
          label: "Terminer",
          onClick: close,
          secondary: true,
        },
      ]
    }
    // if there is nothing else to evaluate
    return [
      {
        label: "Terminer",
        onClick: close,
      },
    ]
  }

  return []
})

const evaluate = async () => {
  const { data, error } = await evaluationStore.evaluate({
    resource: resourceStore.currentId,
    criterion: evaluationStore.currentCriterionSlug,
    ...evaluationStore.evaluation,
  })
  if (error.value) {
    return
  }
  evaluationStore.resetEvaluationInput()
  evaluation.value = data.value!
  evaluationStore.currentStep = "evaluationConfirmation"
}
const nextStep = () => {
  console.log(
    "### currentEvaluationIndex",
    evaluationStore.currentCriterionSlug,
    evaluationStore.selectedCriteria
  )
  if (evaluationStore.currentStep === "choice") {
    selectNextCriterion()
    return
  }

  // go from criteria evaluation to evaluation confirmation
  if (evaluationStore.currentStep === "evaluate") {
    evaluationStore.currentStep = "evaluationConfirmation"
    return
  }
  // select next criterion (we come from either evaluationConfirmation or recommendation)
  selectNextCriterion()
}
const selectNextCriterion = () => {
  let currentEvaluationIndex = evaluationStore.selectedCriteria.indexOf(
    evaluationStore.currentCriterionSlug
  )
  console.log(
    "### select nextcriterion, current index",
    currentEvaluationIndex,
    "selected",
    evaluationStore.selectedCriteria
  )
  evaluationStore.currentStep = "evaluate"
  evaluationStore.currentCriterionSlug =
    evaluationStore.selectedCriteria[currentEvaluationIndex + 1]
  evaluationStore.resetEvaluationInput()
}

const title = computed<string>(() => {
  return (<Record<EvaluationStep, string>>{
    choice: "Évaluer",
    recommend: "Recommander",
    evaluate: evaluationStore.currentCriterion?.name,
    evaluationConfirmation: evaluationStore.currentCriterion?.name,
  })[evaluationStore.currentStep]
})

const close = () => {
  evaluationStore.reset()
  emit("close")
}
</script>
