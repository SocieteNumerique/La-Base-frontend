import { defineStore } from "pinia"

export const useMainStore = defineStore("main", {
  state: () => ({
    hasHeader: false,
    useFullWidthLayout: false,
    version: "",
  }),
  actions: {
    setFullWidth(value: boolean) {
      this.useFullWidthLayout = value
    },
  },
})
