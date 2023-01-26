import { defineStore } from "pinia"
import { Criterion, Evaluation, EvaluationStep } from "~/composables/types"
import { useApiDelete, useApiGet, useApiPost } from "~/composables/api"

type EvaluationState = {
  isEvaluating: boolean
  criterionBySlug: Record<string, Criterion>
  currentCriterionSlug: string
  currentStep: EvaluationStep
  evaluation: Evaluation
  selectedCriteriaInput: string[]
}

export const useEvaluationStore = defineStore("evaluation", {
  state: () =>
    <EvaluationState>{
      criterionBySlug: {},
      currentCriterionSlug: "",
      currentStep: "choice",
      evaluation: {
        evaluation: -1,
        comment: "",
      },
      isEvaluating: true,
      selectedCriteriaInput: [],
    },
  actions: {
    async evaluate(evaluation: Evaluation) {
      const { data, error } = await useApiPost<Evaluation>(
        "evaluations/",
        evaluation,
        {},
        "L'évaluation a bien été publiée"
      )
      return { data, error }
    },
    async getCriteria() {
      const { data, error } = await useApiGet<Criterion[]>("criteria/")
      if (!error.value) {
        const criteria = data.value!
        for (const criterion of criteria) {
          this.criterionBySlug[criterion.slug] = criterion
        }
      }
    },
    async removeEvaluation(resourceId: number, criterionSlug: string) {
      const { data, error } = await useApiDelete(
        `evaluations/${resourceId}-${criterionSlug}/`,
        {},
        "L'évaluation a bien été supprimée",
        true
      )
      return { data, error }
    },
    resetEvaluationInput() {
      this.evaluation = {
        evaluation: undefined,
        comment: "",
      }
    },
    reset() {
      this.currentStep = "choice"
      this.currentCriterionSlug = ""

      this.selectedCriteriaInput = []
    },
  },
  getters: {
    criteria: (state) => {
      return Object.values(state.criterionBySlug).sort(
        (criterionA, criterionB) => criterionA.order - criterionB.order
      )
    },
    currentCriterion: (state): Criterion => {
      return state.criterionBySlug[state.currentCriterionSlug]
    },
    selectedCriteria: (state) => {
      return Object.values(state.selectedCriteriaInput).filter(
        (criteria) => criteria !== "all"
      )
    },
  },
})
