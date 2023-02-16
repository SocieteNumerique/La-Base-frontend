import { defineStore } from "pinia"
import { doNothing } from "~/composables/utils"

export const useMainStore = defineStore("main", {
  state: () => ({
    confirmation: {
      confirmationLabel: "",
      onCancel: doNothing,
      onConfirm: doNothing,
      text: "",
      title: "",
    },
    hasHeader: false,
    useFullWidthLayout: false,
    version: "",
  }),
  actions: {
    resetConfirm() {
      this.confirmation = {
        confirmationLabel: "",
        onCancel: doNothing,
        onConfirm: doNothing,
        text: "",
        title: "",
      }
    },
    setFullWidth(value: boolean) {
      this.useFullWidthLayout = value
    },
  },
})
