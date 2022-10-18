import { defineStore } from "pinia"
import {
  Base,
  BaseCreate,
  BaseWithDetailedResources,
  Collection,
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

function saveRelatedBaseInfosAndSimplify(base: BaseWithDetailedResources) {
  const baseStore = useBaseStore()
  const resourceStore = useResourceStore()
  saveInOtherStores(resourceStore.resourcesById, base.resources!.results)
  baseStore.pageCount = base.resources!.pageCount
  baseStore.resourceCount = base.resources!.count

  // save collections with list of resourceIds
  const newCollections: Collection[] = []
  for (const collection of base.collections) {
    saveInOtherStores(resourceStore.resourcesById, collection.resources!)
    newCollections.push({
      ...collection,
      resources: collection.resources!.map((collection) => collection.id),
    })
  }
  saveInOtherStores(useCollectionStore().collectionsById, newCollections)

  baseStore.basesById[base.id] = {
    ...base,
    collections: newCollections.map((collection) => collection.id),
  }
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
        const newBase = data.value!
        this.basesById[newBase.id] = newBase
        this.basesOrder.push(newBase.id)
      }
      return { data, error }
    },
    async getBase(baseId: number, short = false) {
      const { data, error } = await useApiGet<BaseWithDetailedResources>(
        `bases/${baseId}/${short ? "short/" : ""}`
      )
      if (!error.value && !data.value!.isShort) {
        saveRelatedBaseInfosAndSimplify(data.value!)
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
        saveRelatedBaseInfosAndSimplify(data.value!)
      }
      return { data, error }
    },
    async delete(id: number) {
      const { error } = await useApiDelete(
        `bases/${id}/`,
        {},
        "La base a bien été supprimée",
        true
      )
      if (!error.value) {
        useRouter().push("/")
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
        const bases = data.value!
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
            profileImage: base.profileImage,
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
