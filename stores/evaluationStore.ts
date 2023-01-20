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
    resetRecommendation() {
      this.recommendation = {
        isPositive: undefined,
        comment: "",
      }
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
      return Object.values(state.selectedCriteriaInput)
    },
  },
})
