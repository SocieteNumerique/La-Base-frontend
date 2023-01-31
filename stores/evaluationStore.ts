import { defineStore } from "pinia"
import {
  Criterion,
  Evaluation,
  EvaluationForCriterion,
  EvaluationStep,
} from "~/composables/types"
import { useApiDelete, useApiGet, useApiPost } from "~/composables/api"

type EvaluationState = {
  isEvaluating: boolean
  criterionBySlug: Record<string, Criterion>
  currentCriterionSlug: string
  currentStep: EvaluationStep
  evaluation: Evaluation
  nUpdates: number
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
      // is listened to by ressources view to update when there is a change
      nUpdates: 0,
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
      if (!error.value) {
        this.nUpdates += 1
      }
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
    async getEvaluations(resourceId: number) {
      const { data, error } = await useApiGet<
        Record<string, EvaluationForCriterion>
      >(
        `resources/${resourceId}/evaluations/`,
        {},
        null,
        "Impossible de récupérer la liste des évaluations pour cette ressource"
      )
      if (!error.value) {
        return data.value!
      } else {
        return {}
      }
    },
    async removeEvaluation(resourceId: number, criterionSlug: string) {
      const { data, error } = await useApiDelete(
        `evaluations/${resourceId}-${criterionSlug}/`,
        {},
        "L'évaluation a bien été supprimée",
        true
      )
      if (!error.value) {
        this.nUpdates += 1
      }
      return { data, error }
    },
    resetEvaluationInput() {
      this.evaluation = {
        evaluation: -1,
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
    criteria: (state): Criterion[] => {
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
