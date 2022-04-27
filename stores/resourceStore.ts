import { defineStore } from "pinia"
import { Content, Resource } from "~/composables/types"
import { string } from "postcss-selector-parser"

type NewResourceParams = {
  contents: Content[]
  description: string
  id?: number
  rootBaseId?: number
  title: string
}

type ResourceNavigation = {
  activeMenu: string
  activeSubMenu: string
}

type ResourceState = {
  creationStepIndex: number
  current: Resource
  isCreating: boolean
  navigation: ResourceNavigation
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
      isCreating: false,
      navigation: {
        activeMenu: "informations",
        activeSubMenu: "general",
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
    isMenuActive: (state) => (name: string) => {
      return state.navigation.activeMenu === name
    },
    isSubMenuActive: (state) => (name: string) => {
      return state.navigation.activeSubMenu === name
    },
  },
})
