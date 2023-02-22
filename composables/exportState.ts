import { useRoute, useRouter } from "vue-router"

export const useExportState = () => {
  const route = useRoute()
  const router = useRouter()

  const isExporting = computed<boolean>({
    get: () => (<"1" | "0">route.query.export || "0") === "1",
    set: (state: boolean) => {
      router.push({ query: { ...route.query, export: state ? "1" : "0" } })
    },
  })

  const selectedExport = computed<string[]>({
    get: () => (<string>route.query.exportSections || "").split(","),
    set: (select: string[]) => {
      router.push({
        query: { ...route.query, exportSections: select.join(",") },
      })
    },
  })

  return { isExporting, selectedExport }
}
