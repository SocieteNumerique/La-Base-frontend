import Vue from "vue"

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
        const date = new Date(Date.parse(dateStr))
        return date.toLocaleString(["fr-FR"], {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
      },
    },
  }
})
