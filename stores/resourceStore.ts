import { defineStore } from "pinia"
import {
  Menu,
  MenuByKey,
  Resource,
  ResourceCreate,
  SubMenuByKey,
} from "~/composables/types"
import {
  useApiDelete,
  useApiGet,
  useApiPatch,
  useApiPost,
} from "~/composables/api"
import { useTagStore } from "~/stores/tagStore"

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
        name: "Licence et accès",
        description:
          "Conditions d'accès, de mise à disposition et modalités d'utilisation de la ressource. Veuillez vous assurer que vous disposez bien de l'accord de l'ensemble des auteurs ou détenteurs des droits de la ressource avant de publier la fiche. ",
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
        key: "collections",
        name: "Collections",
        description:
          "Une collection permet de regrouper les fiches ressources de votre base.",
      },
      {
        key: "administration",
        name: "Administration",
        description:
          "Définir les droits d’administration de la fiche ressource.",
      },
      {
        key: "evaluation",
        name: "Évaluation",
        description: "Activer la fonction “évaluation” sur la fiche.",
      },
      {
        key: "contributors",
        name: "Contributeurs",
        description:
          "Les contributeurs ajoutés à cette fiche auront accès à l’ensemble des paramètres de la fiche. Notez que tous les contributeurs de la base dans laquelle est administrée la fiche sont d’ores-et-déjà contributeur de cette fiche.",
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

const navigateTopContentsTop = () => {
  if (process.client) {
    const el = document.getElementById("editing-contents")
    el?.scrollIntoView({ behavior: "smooth" })
  }
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
    async createResource(resource: ResourceCreate) {
      const { data, error } = await useApiPost<Resource>("resources/", resource)
      if (!error.value) {
        this.resourcesById[data.value!.id!] = data.value!
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
        const resource = data.value!
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
      return { error, id }
    },
    markDirty(resourceId: number | null = null) {
      if (resourceId == null && this.currentId == null) return
      if (resourceId == null) resourceId = this.currentId!
      if (!this.resourcesById[resourceId]) return
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
        navigateTopContentsTop()
        return
      }
      this.navigation.activeSubMenu = subMenus[currentSubMenuIx + 1].key
      navigateTopContentsTop()
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
        navigateTopContentsTop()
        return
      }
      this.navigation.activeSubMenu = subMenus[currentSubMenuIx - 1].key
      navigateTopContentsTop()
    },
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
    removeTagFromResource(tagId: number, resourceId: number) {
      const resource = this.resourcesById[resourceId]
      if (resource.tags == null) {
        resource.tags = []
      }
      resource.tags = resource.tags.filter((tagId_: number) => tagId_ !== tagId)
      this.markDirty(resourceId)
    },
    setTagOfCategory(
      tagId: number | undefined,
      categoryId: number,
      resourceId: number
    ) {
      const tagStore = useTagStore()
      const resource = this.resourcesById[resourceId]
      if (!resource.tags) resource.tags = []
      resource.tags = tagStore.setTagOfCategory(
        tagId,
        categoryId,
        resource.tags
      )
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
      const loadingMessage =
        resource?.licenseText?.file?.base64 &&
        resource?.profileImage?.image?.base64
          ? "Chargement des documents"
          : resource?.licenseText?.file?.base64
          ? "Chargement de l'image"
          : resource?.licenseText?.file?.base64
          ? "Chargement du texte de license"
          : false
      const { data, error } = await useApiPatch<Resource>(
        `resources/${resourceId}/`,
        resource,
        {},
        { title: "La ressource a bien été sauvegardée" },
        true,
        loadingMessage
      )
      if (!error.value) {
        this.resourcesById[data.value!.id!] = data.value!
      }
      return { data, error }
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
    async markDuplicates(
      resourceId: number,
      ignoredDuplicates: number[],
      confirmedDuplicates: number[]
    ) {
      const { data, error } = await useApiPatch<{
        id: number
        ignoredDuplicates: number[]
        confirmedDuplicates: number[]
      }>(`resources/${resourceId}/mark_duplicates/`, {
        ignoredDuplicates,
        confirmedDuplicates,
      })
      if (!error.value) {
        this.resourcesById[data.value!.id!] = {
          ...this.resourcesById[data.value!.id!],
          ...data.value!,
        }
      }
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
