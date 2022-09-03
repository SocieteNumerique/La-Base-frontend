import { defineStore } from "pinia"
import {
  Base,
  BaseWithDetailedResources,
  Resource,
  Collection,
  BaseCreate,
  ResourcesWithPagination,
} from "~/composables/types"
import { useResourceStore } from "~/stores/resourceStore"
import { useCollectionStore } from "~/stores/collectionStore"
import { useApiGet, useApiPatch } from "~/composables/api"

function saveInOtherStores(instancesInStore: any, instancesSrc: any[]) {
  for (const instance of instancesSrc) {
    if (
      !instancesInStore[instance.id] ||
      instancesInStore[instance.id].isShort
    ) {
      instancesInStore[instance.id] = instance
    }
  }
}

function simplifyBase(base: BaseWithDetailedResources): Base {
  const res = {
    ...base,
    resourcesInPage: base.resources!.results.map(
      (resource: Resource) => resource.id
    ),
    collections: base.collections!.map(
      (collection: Collection) => collection.id
    ),
  }
  delete res.resourcesInPinnedCollections
  return res
}

export const useBaseStore = defineStore("base", {
  state: () => ({
    basesOrder: <number[]>[],
    basesById: <{ [key: number]: Base }>{},
    currentId: <number | undefined>undefined,
    currentPage: 0,
    pageCount: 1,
    resourceCount: <number | undefined>undefined,
  }),
  actions: {
    async createBase(base: BaseCreate) {
      const { data, error } = await useApiPost<Base>(
        "bases/",
        base,
        {},
        "La base a bien été créée",
        true
      )
      if (!error.value) {
        this.basesById[data.value.id] = data.value
        this.basesOrder.push(data.value.id)
      }
      return { data, error }
    },
    async getBase(baseId: number, short = false) {
      const { data, error } = await useApiGet<BaseWithDetailedResources>(
        `bases/${baseId}/${short ? "short/" : ""}`
      )
      if (!error.value && !data.value.isShort) {
        const resourceStore = useResourceStore()
        saveInOtherStores(
          resourceStore.resourcesById,
          data.value.resources!.results
        )
        this.pageCount = data.value.resources!.pageCount
        this.resourceCount = data.value.resources!.count
        saveInOtherStores(
          resourceStore.resourcesById,
          data.value.resourcesInPinnedCollections!
        )
        saveInOtherStores(
          useCollectionStore().collectionsById,
          data.value.collections!
        )
        const base = simplifyBase(data.value)
        this.basesById[base.id] = base
      }
      return { data, error }
    },
    async update(partialBase: any) {
      const { data, error } = await useApiPatch<BaseWithDetailedResources>(
        `bases/${partialBase.id}/`,
        partialBase,
        {},
        "La base a bien été modifiée",
        true
      )
      if (!error.value) {
        this.basesById[data.value.id!] = simplifyBase(data.value)
      }
      return { data, error }
    },
    async updateResourcesInPage(pageOneBased: number) {
      const { data, error } = await useApiGet<ResourcesWithPagination>(
        `bases/${this.currentId}/resources/`,
        { page: pageOneBased }
      )
      if (!error.value) {
        const resourceStore = useResourceStore()
        saveInOtherStores(resourceStore.resourcesById, data.value!.results)
        this.pageCount = data.value!.pageCount
        this.resourceCount = data.value!.count
        this.basesById[this.currentId!].resourcesInPage =
          data.value!.results.map((resource) => resource.id)
      }
    },
    async delete(id: number) {
      const { error } = await useApiDelete(
        `bases/${id}/`,
        {},
        "La base a bien été supprimée",
        true
      )
      if (!error.value) {
        delete this.basesById[id]
        this.basesOrder.filter((curr_id) => curr_id != id)
        return true
      }
    },
    async refreshBases() {
      const { data, error } = await useApiGet<Base[]>(
        "bases/",
        {},
        null,
        "impossible de récupérer la liste des bases"
      )
      if (!error.value) {
        const bases = data.value
        for (const base of bases) {
          this.basesById[base.id] = base
        }
        this.basesOrder = bases.map((base: Base) => base.id)
      }
    },
    removeCollectionIdFromBase(collectionId: number) {
      this.basesById[this.currentId!].collections =
        this.current.collections?.filter(
          (collection) => collection != collectionId
        )
    },
    addCollectionIdToBase(collection: Collection) {
      this.basesById[collection.base].collections?.push(collection.id)
    },
  },
  getters: {
    bases: (state) => {
      return state.basesOrder.map((baseId) => state.basesById[baseId])
    },
    baseOptions: (state) => {
      return state.basesOrder
        .map((baseId) => state.basesById[baseId])
        .filter((base) => base?.canWrite || base?.canAddResources)
        .map((base) => {
          return {
            title: base.title,
            id: base.id,
            imageProfile: base.profileImage,
          }
        })
    },
    current: (state): Base => {
      if (state.currentId) {
        return state.basesById[state.currentId]
      }
      return {
        id: -1,
        title: "",
        owner: -1,
      }
    },
    hasBases: (state) => {
      return state.basesOrder
        .map((baseId) => state.basesById[baseId])
        .filter((base) => base?.canWrite || base?.canAddResources).length
    },
  },
})
