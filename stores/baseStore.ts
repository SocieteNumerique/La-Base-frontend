import { defineStore } from "pinia"
import { Base, BaseWithDetailedResources, Resource } from "~/composables/types"
import { useResourceStore } from "~/stores/resourceStore"

export const useBaseStore = defineStore("base", {
  state: () => ({
    basesOrder: <number[]>[],
    basesById: <{ [key: number]: Base }>{},
    currentId: <number | undefined>undefined,
  }),
  actions: {
    async refreshBases() {
      const { data, error } = await useApiGet<Base[]>("bases/")
      if (!error.value) {
        console.log("### refreshBases, value", data.value)
        const bases = data.value
        for (const base of bases) {
          this.basesById[base.id] = base
        }
        this.basesOrder = bases.map((base) => base.id)
      }
    },
    async getBase(baseId: number, short = false) {
      const { data, error } = await useApiGet<BaseWithDetailedResources>(
        `bases/${short ? "short/" : ""}${baseId}/`
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
          resources: resources!.map((resource) => resource.id),
        }
        this.basesById[base.id] = base
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
