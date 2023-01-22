<template>
  <DsfrModal :opened="true" :title="title" :actions="actions" @close="close">
    <EvaluationModalChoice v-if="evaluationStore.currentStep === 'choice'" />
    <EvaluationModalRecommendation
      v-if="evaluationStore.currentStep === 'recommend'"
    />
    <EvaluationModalRecommendationConfirmation
      v-if="evaluationStore.currentStep === 'recommendationConfirmation'"
      :recommendation="recommendation"
      @delete="evaluationStore.currentStep = 'choice'"
    />
    <EvaluationModalEvaluate
      v-if="evaluationStore.currentStep === 'evaluate'"
    />
    <EvaluationModalEvaluateConfirm
      v-if="evaluationStore.currentStep === 'evaluationConfirmation'"
      :evaluation="evaluation"
      @delete="evaluationStore.currentStep = 'choice'"
    />
  </DsfrModal>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useEvaluationStore } from "~/stores/evaluationStore"
import { Evaluation, EvaluationStep, Recommendation } from "~/composables/types"
import { useResourceStore } from "~/stores/resourceStore"

const evaluationStore = useEvaluationStore()
const resourceStore = useResourceStore()
const recommendation = ref<Recommendation>()
const evaluation = ref<Evaluation>()

const emit = defineEmits(["close"])

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

  if (evaluationStore.currentStep === "recommend") {
    return [
      {
        label: "Publier",
        onClick: recommend,
        disabled:
          evaluationStore.recommendation.isPositive == null ||
          evaluationStore.recommendation.comment.length < 30,
      },
    ]
  }

  if (evaluationStore.currentStep === "recommendationConfirmation") {
    // if there is another criterion, go to this one
    if (evaluationStore.selectedCriteria.length >= 2) {
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

  if (evaluationStore.currentStep === "evaluate") {
    return [
      {
        label: "Publier",
        onClick: evaluate,
        disabled:
          evaluationStore.evaluation.evaluation == null ||
          evaluationStore.evaluation.comment.length < 30,
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
  evaluation.value = data.value!
  evaluationStore.currentStep = "evaluationConfirmation"
}
const recommend = async () => {
  const { data, error } = await evaluationStore.recommend({
    resource: resourceStore.currentId,
    ...evaluationStore.recommendation,
  })
  if (error.value) {
    return
  }
  recommendation.value = data.value!
  evaluationStore.currentStep = "recommendationConfirmation"
}
const nextStep = () => {
  console.log(
    "### currentEvaluationIndex",
    evaluationStore.currentCriterionSlug,
    evaluationStore.selectedCriteria
  )
  if (evaluationStore.currentStep === "choice") {
    if (evaluationStore.selectedCriteria.indexOf("recommend") !== -1) {
      evaluationStore.currentStep = "recommend"
      evaluationStore.currentCriterionSlug = "recommend"
    } else {
      evaluationStore.currentStep = "evaluate"
    }
    return
  }

  // go from criteria evaluation to evaluation confirmation
  if (evaluationStore.currentStep === "evaluate") {
    evaluationStore.currentStep = "evaluationConfirmation"
    return
  }
  // select next criteria (we come from either evaluationConfirmation or recommendation)
  const currentEvaluationIndex = evaluationStore.selectedCriteria.indexOf(
    evaluationStore.currentCriterionSlug
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
