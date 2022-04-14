import {defineStore} from "pinia"
import {Base, Resource} from "~/composables/types"

export const useBaseStore = defineStore('base', {
  state: () => ({
    bases: <number[]>[],
    basesById: <{ [key: number]: Base }>{},
    resourcesById: <{ [key: number]: Resource }>{},
  }),
  actions: {
    async refreshBases() {
      const {data, error} = await useApiGet<Base[]>("bases")
      if (!error.value) {
        const bases = data.value
        for (const base of bases) {
          this.basesById[base.id] = base
        }
        this.bases = bases.map(base => base.id)
      }
    },
    async getBase(baseId: number) {
      const {data, error} = await useApiGet<Base>(`bases/${baseId}`)
      if (!error.value) {
        const base = data.value
        this.basesById[base.id] = base
      }
    },
    async getResource(resourceId: number) {
      const {data, error} = await useApiGet<Resource>(`resources/${resourceId}`)
      if (!error.value) {
        const resource = data.value
        this.resourcesById[resource.id] = resource
      }
    },
  },
})
