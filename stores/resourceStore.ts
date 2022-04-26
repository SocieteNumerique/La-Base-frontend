import { defineStore } from "pinia"
import { Content, Resource } from "~/composables/types"

type NewResourceParams = {
  id?: number
  description: string
  rootBaseId?: number
  title: string
  contents: Content[]
}

type ResourceState = {
  creationStepIndex: number
  current: Resource
  newParams: NewResourceParams
}

const CREATION_STEPS = ["publish_as", "init_general_info", "general_info"]

export const useResourceStore = defineStore("resource", {
  state: () =>
    <ResourceState>{
      creationStepIndex: 0,
      current: {
        id: undefined,
        rootBaseId: undefined,
        title: "",
        content: "",
      },
      newParams: {
        id: undefined,
        description: "",
        rootBaseId: undefined,
        title: "",
        contents: [],
      },
    },
  actions: {
    async incrementCreationStep() {
      this.creationStepIndex = Math.min(
        CREATION_STEPS.length - 1,
        this.creationStepIndex + 1
      )
    },
    async decrementCreationStep() {
      this.creationStepIndex = Math.max(0, this.creationStepIndex - 1)
    },
  },
  getters: {
    creationStep: (state) => {
      return CREATION_STEPS[state.creationStepIndex]
    },
  },
})
