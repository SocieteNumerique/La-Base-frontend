import { defineStore } from "pinia"
import {
  Criterion,
  Evaluation,
  EvaluationStep,
  Recommendation,
} from "~/composables/types"
import { useApiDelete, useApiGet, useApiPost } from "~/composables/api"

type EvaluationState = {
  isEvaluating: boolean
  criterionBySlug: Record<string, Criterion>
  currentCriterionSlug: string
  currentStep: EvaluationStep
  evaluation: Evaluation
  recommendation: Recommendation
  selectedCriteriaInput: string[]
}

export const useEvaluationStore = defineStore("collection", {
  state: () =>
    <EvaluationState>{
      criterionBySlug: {},
      currentCriterionSlug: "",
      currentStep: "choice",
      evaluation: {
        evaluation: undefined,
        comment: "",
      },
      isEvaluating: true,
      recommendation: {
        isPositive: undefined,
        comment: "",
      },
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
    async recommend(recommendation: Recommendation) {
      const { data, error } = await useApiPost<Recommendation>(
        "recommendations/",
        recommendation,
        {},
        "La recommendation a bien été publiée"
      )
      return { data, error }
    },
    async removeRecommendation(resourceId: number) {
      const { data, error } = await useApiDelete<Recommendation>(
        `recommendations/${resourceId}/`,
        {},
        "La recommendation a bien été supprimée",
        true
      )
      return { data, error }
    },
    async removeEvaluation(resourceId: number, criterionSlug: string) {
      const { data, error } = await useApiDelete<Recommendation>(
        `evaluations/${resourceId}-${criterionSlug}/`,
        {},
        "L'évaluation a bien été supprimée",
        true
      )
      return { data, error }
    },
    resetEvaluationInput() {
      this.recommendation = {
        isPositive: undefined,
        comment: "",
      }
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
      let toReturn = Object.values(state.selectedCriteriaInput)
      if (toReturn.filter((criteria) => criteria === "all").length > 1) {
        toReturn = toReturn.filter(
          (criteria, index) => index === 0 || criteria != "all"
        )
      }
      return toReturn
    },
  },
})
