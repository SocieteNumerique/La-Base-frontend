import { useRoute, useRouter } from "vue-router"

export const useExportState = () => {
  const route = useRoute()
  const router = useRouter()

  const isExporting = computed<boolean>({
    get: () => (<"1" | "0">route.query.export || "0") === "1",
    set: (state: boolean) => {
      if (state) {
        router.push({ query: { ...route.query, export: state ? "1" : "0" } })
      } else {
        const query = { ...route.query }
        delete query.export
        router.push({ query })
      }
    },
  })

  const selectedExport = computed<string[]>({
    get: () => {
      const toReturn = (<string>route.query.exportSections || "").split(",")
      if (toReturn.length && toReturn[0] === "") {
        return []
      }
      return toReturn
    },
    set: (select: string[]) => {
      if (select.length) {
        router.push({
          query: { ...route.query, exportSections: select.join(",") },
        })
      } else {
        const query = { ...route.query }
        delete query.exportSections
        router.push({ query })
      }
    },
  })

  return { isExporting, selectedExport }
}
