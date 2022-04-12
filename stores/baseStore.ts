import {defineStore} from "pinia"
import {Base, Ressource} from "~/composables/types"

export const useBaseStore = defineStore('base', {
  state: () => ({
    bases: <number[]>[],
    basesById: <{ [key: number]: Base }>{},
    ressourcesById: <{ [key: number]: Ressource }>{},
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
    async getRessource(ressourceId: number) {
      const {data, error} = await useApiGet<Ressource>(`ressources/${ressourceId}`)
      if (!error.value) {
        const ressource = data.value
        this.ressourcesById[ressource.id] = ressource
      }
    },
  },
})
