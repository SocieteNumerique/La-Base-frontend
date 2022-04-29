import { defineStore } from "pinia"
import { Base } from "~/composables/types"

export const useBaseStore = defineStore("base", {
  state: () => ({
    basesOrder: <number[]>[],
    basesById: <{ [key: number]: Base }>{},
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
    async getBase(baseId: number) {
      const { data, error } = await useApiGet<Base>(`bases/${baseId}`)
      if (!error.value) {
        const base = data.value
        this.basesById[base.id] = base
      }
    },
  },
  getters: {
    bases: (state) => {
      return state.basesOrder.map((baseId) => state.basesById[baseId])
    },
    baseOptions: (state) => {
      return state.basesOrder.map((baseId) => {
        return { text: state.basesById[baseId].title, value: baseId }
      })
    },
    hasBases: (state) => {
      return !!state.basesOrder.length
    },
  },
})
