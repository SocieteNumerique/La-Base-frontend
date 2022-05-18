import Vue from "vue"
import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      date: (dateStr: string) => {
        if (dateStr == null) {
          return ""
        }
        if (dateStr[dateStr.length - 1] === "Z") {
          dateStr = dateStr.substring(0, dateStr.length - 1)
        }
        console.log("### input date", dateStr)
        const date = new Date(Date.parse(dateStr))
        return date.toLocaleString(["fr-FR"], {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      },
    },
  }
})
