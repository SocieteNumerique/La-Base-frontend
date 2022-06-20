import { defineStore } from "pinia"
import {
  Base,
  BaseWithDetailedResources,
  Resource,
  Collection,
  BaseCreate,
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
    resources: base.resources!.map((resource: Resource) => resource.id),
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
        const router = useRouter()
        router.push(`/base/${data.value.id}`)
      }
      return { data, error }
    },
    async getBase(baseId: number, short = false) {
      const { data, error } = await useApiGet<BaseWithDetailedResources>(
        `bases/${baseId}/${short ? "short/" : ""}`
      )
      if (!error.value) {
        const resourceStore = useResourceStore()
        saveInOtherStores(resourceStore.resourcesById, data.value.resources!)
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
    async delete(id: number) {
      const { error } = await useApiDelete(
        `bases/${id}/`,
        {},
        "La base a bien été supprimée",
        true
      )
      if (!error.value) {
        delete this.basesById[id]
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
        .filter((base) => base?.canWrite)
        .map((base) => {
          return { text: base.title, value: base.id }
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
      return !!state.basesOrder.length
    },
  },
})
