import { defineStore } from "pinia"
import { Content, Resource } from "~/composables/types"
import { string } from "postcss-selector-parser"
import { useApiPost } from "~/composables/api"

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

type ResourcesById = {
  [id: number]: Resource
}

type ResourceState = {
  creationStepIndex: number
  current: Resource
  isCreating: boolean
  navigation: ResourceNavigation
  newParams: NewResourceParams
  resourcesById: ResourcesById
}

const CREATION_STEPS = ["select_base", "init_general_info", "general_info"]

export const useResourceStore = defineStore("resource", {
  state: () =>
    <ResourceState>{
      creationStepIndex: 0,
      current: {
        id: undefined,
        rootBaseId: undefined,
        title: "",
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
      resourcesById: {},
    },
  actions: {
    async createResource(resource: Resource) {
      const { data, error } = await useApiPost<Resource>("resources/", resource)
      if (!error.value) {
        this.resourcesById[data.value.id!] = data.value
        return data.value
      }
    },
    decrementCreationStep() {
      this.creationStepIndex = Math.max(0, this.creationStepIndex - 1)
    },
    incrementCreationStep() {
      this.creationStepIndex = Math.min(
        CREATION_STEPS.length - 1,
        this.creationStepIndex + 1
      )
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
