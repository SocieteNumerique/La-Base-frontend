import { defineStore } from "pinia"
import { useApiGet } from "~/composables/api"

type Tooltip = {
  content: string
  id: number
  image?: string
  page: string
  position: "right" | "left" | "bottom" | "top"
  slug: string
  title: string
}

export const useIntroStore = defineStore("intro", {
  state: () => {
    return { tooltipsById: <{ [key: number]: Tooltip }>{}, active: 0 }
  },
  actions: {
    async getTooltips() {
      const { data, error } = await useApiGet<Tooltip[]>("tooltips/")
      if (!error.value) {
        for (const tooltip of data.value!) {
          this.tooltipsById[tooltip.id] = tooltip
        }
      }
    },
    hide() {
      this.active = 0
    },
  },
  getters: {
    current: (state): Tooltip | null => {
      if (!state.active) {
        return null
      }
      return state.tooltipsById[state.active]
    },
  },
})
