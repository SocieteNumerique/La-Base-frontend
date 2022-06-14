import { defineStore } from "pinia"

type LoadingStoreState = {
  statePerKey: { [key: string]: "loading" | "done" | "error" }
}

export const useLoadingStore = defineStore("loading", {
  state: () =>
    <LoadingStoreState>{
      statePerKey: {},
    },
  actions: {
    markLoading(key: string) {
      this.statePerKey[key] = "loading"
    },
    markDone(key: string) {
      this.statePerKey[key] = "done"
      this.$patch({ [key]: "done" })
    },
    markError(key: string) {
      this.statePerKey[key] = "error"
    },
  },
  getters: {
    isLoading: (state) => {
      return (key: string) => {
        return state.statePerKey[key] === "loading"
      }
    },
  },
})
