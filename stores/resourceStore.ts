import { defineStore } from "pinia"
import {
  Menu,
  MenuByKey,
  MenuWithSubMenusByKey,
  Resource,
  SubMenuByKey,
} from "~/composables/types"
import { useApiPost, useApiGet, useApiPatch } from "~/composables/api"

export const navigationMenus: Menu[] = [
  {
    key: "informations",
    name: "Informations",
    subMenus: [
      {
        key: "general",
        name: "Général",
        description: "Général quoi",
      },
      {
        key: "indexation",
        name: "Indexation",
        description:
          "Cette indexation est générale, elle permettra, si votre ressource est publique, aux autres utilisateurs de la base de la trouver via le moteur de recherche.",
      },
      { key: "credits", name: "Crédits", description: "Les crédits" },
      {
        key: "territory",
        name: "Territoire",
        description: "Description du territoire",
      },
      {
        key: "license",
        name: "Licence",
        description: "Description de la licence",
      },
      { key: "label", name: "Label", description: "", disabled: true },
    ],
  },
  {
    key: "contents",
    name: "Contenus",
    subMenus: [],
  },
  {
    key: "parameters",
    name: "Paramètres",
    subMenus: [
      { key: "state", name: "Statut", description: "Description du statut" },
      {
        key: "administration",
        name: "Administration",
        description: "Description du Administration",
      },
      {
        key: "comments",
        name: "Commentaires",
        description: "Description du Commentaires",
        disabled: true,
      },
      {
        key: "assessments",
        name: "Évaluations",
        disabled: true,
        description: "Description du Évaluations",
      },
      {
        key: "reports",
        name: "Signalement",
        disabled: true,
        description: "Description du Signalement",
      },
    ],
  },
]
export const navigationMenuByKey: MenuByKey = {}
for (const menu of navigationMenus) {
  const subMenusByKey: SubMenuByKey = {}
  for (const subMenu of menu.subMenus) {
    subMenusByKey[subMenu.key] = subMenu
  }
  const menuCopy: MenuWithSubMenusByKey = { ...menu, subMenus: subMenusByKey }
  navigationMenuByKey[menu.key] = menuCopy
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
    getCurrentNavigationIndex() {
      let currentMenuIx = -1
      let currentSubMenuIx = -1

      for (const [menuIx, menu] of Object.entries(navigationMenus)) {
        if (menu.key !== this.navigation.activeMenu) {
          continue
        }
        currentMenuIx = parseInt(menuIx)
        if (!menu.subMenus.length) {
          currentSubMenuIx = -1
          break
        }
        for (const [subMenuIx, subMenu] of Object.entries(menu.subMenus)) {
          if (subMenu.key !== this.navigation.activeSubMenu) {
            continue
          }
          currentSubMenuIx = parseInt(subMenuIx)
          break
        }
      }
      return { currentMenuIx, currentSubMenuIx }
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
    navigationNext() {
      if (this.isNavigationNextDisabled) {
        return
      }
      const { currentMenuIx, currentSubMenuIx } =
        this.getCurrentNavigationIndex()
      const currentMenu = navigationMenus[currentMenuIx]
      const subMenus = currentMenu.subMenus

      if (currentSubMenuIx === -1 || currentSubMenuIx === subMenus.length - 1) {
        this.navigation.activeMenu = navigationMenus[currentMenuIx + 1].key
        if (navigationMenus[currentMenuIx + 1].subMenus.length) {
          this.navigation.activeSubMenu =
            navigationMenus[currentMenuIx + 1].subMenus[0].key
        }
        return
      }
      this.navigation.activeSubMenu = subMenus[currentSubMenuIx + 1].key
    },
    navigationPrevious() {
      if (this.isNavigationPreviousDisabled) {
        return
      }

      const { currentMenuIx, currentSubMenuIx } =
        this.getCurrentNavigationIndex()
      const currentMenu = navigationMenus[currentMenuIx]
      const subMenus = currentMenu.subMenus

      if (currentSubMenuIx === -1 || currentSubMenuIx === 0) {
        this.navigation.activeMenu = navigationMenus[currentMenuIx - 1].key
        const subMenus = navigationMenus[currentMenuIx - 1].subMenus
        if (subMenus.length) {
          this.navigation.activeSubMenu = subMenus[subMenus.length - 1].key
        }
        return
      }
      this.navigation.activeSubMenu = subMenus[currentSubMenuIx - 1].key
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
      const { data, error } = await useApiPatch<Resource>(
        `resources/${resourceId}/`,
        resource
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
        modified: "",
        contents: [],
        producerState: "",
        status: "draft",
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
    isNavigationNextDisabled: (state) => {
      const lastMenu = navigationMenus[navigationMenus.length - 1]
      if (state.navigation.activeMenu !== lastMenu.key) {
        return false
      }
      if (!lastMenu.subMenus.length) {
        return true
      }
      return (
        state.navigation.activeSubMenu ===
        lastMenu.subMenus[lastMenu.subMenus.length - 1].key
      )
    },
    isNavigationPreviousDisabled: (state) => {
      const firstMenu = navigationMenus[0]
      if (state.navigation.activeMenu !== firstMenu.key) {
        return false
      }
      if (!firstMenu.subMenus.length) {
        return true
      }
      return state.navigation.activeSubMenu === firstMenu.subMenus[0].key
    },
  },
})
