import { defineStore } from "pinia"
import { Alert } from "~/composables/types"
import { generateRandomId } from "~/composables/utils"

const SUCCESS_ALERT_DURATION = 3000 // ms
const ERROR_ALERT_DURATION = 10000 // ms

export const useAlertStore = defineStore("alerts", {
  state: () => {
    return { alerts: <{ [key: string]: Alert }>{} }
  },
  actions: {
    alert(title: string, text = "", type = "success") {
      if (process.server) {
        return
      }
      const alertId = generateRandomId()
      this.alerts[alertId] = { text, title, type, id: alertId }
      const duration =
        type === "success" ? SUCCESS_ALERT_DURATION : ERROR_ALERT_DURATION
      setTimeout(() => this.removeAlert(alertId), duration)
    },
    removeAlert(alertId: string) {
      delete this.alerts[alertId]
    },
  },
  getters: {
    getAlerts: (state): Alert[] => {
      const toReturn = Object.values(state.alerts)
      console.log("### alerts", toReturn)
      return toReturn
    },
  },
})
