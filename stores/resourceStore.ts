import { defineStore } from "pinia"
import { Content, Resource } from "~/composables/types"
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
      const { data, error } = await useApiGet<Content[]>(
        `resources/${resourceId}/contents/`
      )
      if (!error.value) {
        return data.value
      }
    },
    getDefaultContent(type: string): Content {
      if (type === "text") return { type: "text", text: "", nbCol: 3 }
      if (type === "file") return { type: "file", nbCol: 1 }
      if (type === "link") return { type: "link", link: "", nbCol: 1 }
      throw "unknown type"
    },
    async createContent(resourceId: number, content: Content) {
      const { data, error } = await useApiPost<Content>(`contents/`, {
        ...content,
        resource: resourceId,
      })
      if (!error.value) {
        return data.value
      }
    },
    async updateContent(content: Content) {
      const { data, error } = await useApiPatch<Content>(
        `contents/${content.id}/`,
        content
      )
      if (!error.value) {
        return data.value
      }
    },
    async addContent(type: string, index: number): Promise<Content> {
      const content = this.getDefaultContent(type)
      content.index = index
      const createdContent = await this.createContent(
        this.current!.id!,
        content
      )
      if (createdContent) return createdContent
      throw "error at creating Content"
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
