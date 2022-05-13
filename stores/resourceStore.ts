import { defineStore } from "pinia"
import { Resource } from "~/composables/types"
import { useApiPost, useApiGet, useApiPatch } from "~/composables/api"

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
        activeSubMenu: "indexation",
      },
      resourcesById: {},
    },
  actions: {
    addTagToResource(tagId: number, resourceId: number) {
      const resource = this.resourcesById[resourceId]
      if (resource.tags == null) {
        resource.tags = []
      }
      if (resource.tags.indexOf(tagId) === -1) {
        resource.tags.push(tagId)
      }
    },
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
    removeTagFromResource(tagId: number, resourceId: number) {
      const resource = this.resourcesById[resourceId]
      if (resource.tags == null) {
        resource.tags = []
      }
      resource.tags = resource.tags.filter((tagId_: number) => tagId_ !== tagId)
    },
    async save(resourceId: number | undefined = undefined) {
      if (resourceId == null) {
        resourceId = this.currentId
      }
      const resource = this.resourcesById[resourceId!]
      const payload: any = {}
      const updateFields = [
        "title",
        "root_base",
        "is_draft",
        "description",
        "zip_code",
        "linked_resources",
        "internal_producers",
        "tags",
      ]
      for (const field of updateFields) {
        payload[field] = resource[field]
      }
      const { data, error } = await useApiPatch<Resource>(
        `resources/${resourceId}/`,
        payload
      )
      if (!error.value) {
        console.log("### save resource", resourceId)
        this.resourcesById[data.value.id!] = data.value
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
        contents: [],
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
