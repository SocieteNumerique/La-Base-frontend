import { defineStore } from "pinia"
import { Resource } from "~/composables/types"
import { useApiPost } from "~/composables/api"

type ResourceNavigation = {
  activeMenu: string
  activeSubMenu: string
}

type ResourcesById = {
  [id: number]: Resource
}

type ResourceState = {
  creationStepIndex: number
  currentId?: number
  isCreating: boolean
  navigation: ResourceNavigation
  resourcesById: ResourcesById
}

export const useResourceStore = defineStore("resource", {
  state: () =>
    <ResourceState>{
      currentId: undefined,
      navigation: {
        activeMenu: "informations",
        activeSubMenu: "general",
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
    async getResource(resourceId: number) {
      const { data, error } = await useApiGet<Resource>(
        `resources/${resourceId}/`
      )
      if (!error.value) {
        const resource = data.value
        this.resourcesById[resource.id!] = resource
        console.log("### got resource", resourceId, resource.id)
      }
    },
    async getResourceContents(resourceId: number) {
      const { data, error } = await useApiGet<Resource>(
        `resources/${resourceId}/contents/`
      )
      if (!error.value) {
        return data.value
      }
    },
    setCurrentId(resourceId: number) {
      this.currentId = resourceId
    },
  },
  getters: {
    current: (state): Resource => {
      if (state.currentId) {
        return state.resourcesById[state.currentId]
      }
      return {
        id: undefined,
        rootBaseId: undefined,
        title: "",
      }
    },
    isMenuActive:
      (state) =>
      (name: string): boolean => {
        return state.navigation.activeMenu === name
      },
    isSubMenuActive:
      (state) =>
      (name: string): boolean => {
        return state.navigation.activeSubMenu === name
      },
  },
})
