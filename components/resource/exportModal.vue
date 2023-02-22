<template>
  <DsfrModal
    title="Exporter la fiche"
    :actions="actions"
    :opened="true"
    @close="emit('close')"
  >
    <DsfrCheckboxSet
      v-model="exportInput"
      legend="Sections à exporter"
      :options="options"
      @change="onExportInput"
    />
  </DsfrModal>
</template>

<script setup lang="ts">
import { useExportState } from "~/composables/exportState"

const emit = defineEmits(["close"])
const { isExporting, selectedExport } = useExportState()

const exportInput = ref<string[]>([])

const onExportInput = () => {
  console.log("### input", Object.values(exportInput.value))
  selectedExport.value = Object.values(exportInput.value)
}

const options = [
  {
    label: "Informations",
    id: "informations",
    name: "informations",
  },
  {
    label: "Ressource",
    id: "resourceInput",
    name: "resource",
  },
  {
    label: "Évaluations",
    id: "evaluations",
    name: "evaluations",
  },
]

const actions = computed(() => {
  return [
    {
      label: "Télécharger",
      onClick: () => {
        isExporting.value = true
        emit("close")
      },
    },
    {
      label: "Fermer",
      onClick: () => {
        emit("close")
        isExporting.value = false
      },
      secondary: true,
    },
  ]
})
</script>
