import { defineStore } from "pinia"
import { Base, BaseWithDetailedResources, Resource } from "~/composables/types"
import { useResourceStore } from "~/stores/resourceStore"
import { useApiGet } from "~/composables/api"

export const useBaseStore = defineStore("base", {
  state: () => ({
    basesOrder: <number[]>[],
    basesById: <{ [key: number]: Base }>{},
    currentId: <number | undefined>undefined,
  }),
  actions: {
    async createBase(baseTitle: string) {
      const { data, error } = await useApiPost<Base>(
        "bases/",
        { title: baseTitle },
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
        const resources = data.value.resources!
        for (const resource of resources) {
          if (!resourceStore.resourcesById[resource.id]) {
            resourceStore.resourcesById[resource.id] = resource
          }
        }
        const base = {
          ...data.value,
          resources: resources!.map((resource: Resource) => resource.id),
        }
        this.basesById[base.id] = base
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
  },
  getters: {
    bases: (state) => {
      return state.basesOrder.map((baseId) => state.basesById[baseId])
    },
    baseOptions: (state) => {
      return state.basesOrder
        .map((baseId) => state.basesById[baseId])
        .filter((base) => base.canWrite)
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
