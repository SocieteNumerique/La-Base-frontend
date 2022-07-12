import { defineStore } from "pinia"
import {
  Menu,
  MenuByKey,
  PinStatus,
  Resource,
  ResourceCreate,
  SubMenuByKey,
} from "~/composables/types"
import { useApiGet, useApiPatch, useApiPost } from "~/composables/api"
import { useBaseStore } from "~/stores/baseStore"

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
          "L’indexation permettra aux autres utilisateurs de la base de la trouver via le moteur de recherche (si votre ressource est publique).",
      },
      {
        key: "credits",
        name: "Crédits",
        description:
          "Qui a produit la ressource ? Les producteurs que vous indiquerez seront visibles dans la fiche en consultation.",
      },
      {
        key: "territory",
        name: "Territoire",
        description: "",
      },
      {
        key: "license",
        name: "Licence",
        description: "Description de la licence",
      },
      {
        key: "label",
        name: "Label NEC",
        description:
          "Le label Numérique en Commun[s] décerné par l'Agence Nationale de la Cohésion des Territoires vise à identifier des dispositifs concourant à l'inclusion numérique sur l'ensemble du territoire. Les ressources éligibles sont des dispositifs numériques, tangibles et pédagogiques.",
      },
    ],
  },
  {
    key: "contents",
    name: "Ressource",
    subMenus: [],
  },
  {
    key: "parameters",
    name: "Paramètres",
    subMenus: [
      {
        key: "state",
        name: "Statut",
        description:
          "Paramétrer les droits de consultation de la fiche.<br />Vous pouvez modifier ces droits à tout moment.",
      },
      {
        key: "administration",
        name: "Administration",
        description:
          "Définir les droits d’administration de la fiche ressource.",
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
  navigationMenuByKey[menu.key] = { ...menu, subMenus: subMenusByKey }
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
      this.markDirty(resourceId)
    },
    async createResource(resource: ResourceCreate) {
      const baseStore = useBaseStore()
      const { data, error } = await useApiPost<Resource>("resources/", resource)
      if (!error.value) {
        this.resourcesById[data.value.id!] = data.value
        baseStore.basesById[data.value.rootBase!]?.resources?.push(
          data.value.id!
        )
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
    async getResource(resourceId: number, short = false) {
      const { data, error } = await useApiGet<Resource>(
        `resources/${resourceId}/${short ? "short/" : ""}`
      )
      if (!error.value) {
        const resource = data.value
        this.resourcesById[resourceId] = resource
        return resource
      }
    },
    async delete(id: number | undefined = undefined) {
      if (id === undefined) id = this.currentId!
      const { error } = await useApiDelete(
        `resources/${id}/`,
        {},
        "La ressource a bien été supprimée",
        true
      )
      if (!error.value) {
        delete this.resourcesById[id]
        return true
      }
    },
    markDirty(resourceId: number | null = null) {
      if (resourceId == null && this.currentId == null) {
        return
      }
      if (resourceId == null) {
        resourceId = this.currentId!
      }
      this.resourcesById[resourceId].dirty = true
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
      this.markDirty(resourceId)
    },
    resetNavigation() {
      this.navigation = { activeMenu: "informations", activeSubMenu: "general" }
    },
    async save(resourceId: number | undefined = undefined) {
      if (resourceId == null) {
        resourceId = this.currentId
      }
      const resource = this.resourcesById[resourceId!]
      const { data, error } = await useApiPatch<Resource>(
        `resources/${resourceId}/`,
        resource,
        {},
        { title: "La ressource a bien été sauvegardée" },
        true
      )
      if (!error.value) {
        this.resourcesById[data.value.id!] = data.value
      }
    },
    setCurrentId(resourceId: number) {
      this.currentId = resourceId
    },
    setGridViewActivation(isGridViewEnabled: boolean, resourceId: number) {
      const resource = this.resourcesById[resourceId]
      resource.isGridViewEnabled = isGridViewEnabled
      this.markDirty(resourceId)
    },
    refreshPinStatus(pinnedInBases: number[], resourceId: number) {
      const resource = this.resourcesById[resourceId]
      resource.pinnedInBases = pinnedInBases
    },
  },
  getters: {
    current: (state): Resource => {
      if (state.currentId) {
        return state.resourcesById[state.currentId]
      }
      return {
        contents: [],
        id: -1,
        isShort: true,
        labelState: "",
        modified: "",
        producerState: "",
        resourceCreatedOn: "",
        state: "draft",
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
