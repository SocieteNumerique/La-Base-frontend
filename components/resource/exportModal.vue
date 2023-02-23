<template>
  <DsfrModal
    title="Exporter la fiche"
    :actions="actions"
    :opened="true"
    @close="emit('close')"
  >
    <template v-if="step === 'choice'">
      <p>Vous pouvez télécharger différents éléments de la fiche.</p>
      <DsfrRadioButtonSet
        v-model="selectedStepInput"
        name="exportChoice"
        :options="options"
        :required="true"
        legend="Choisissez le format d'export"
        class="fr-mb-2w fr-mt-11v"
      />
    </template>
    <template v-if="step === 'print'">
      <DsfrCheckboxSet
        v-model="exportInput"
        legend="Sections à afficher"
        :options="printOptions"
        @change="onExportInput"
      />
    </template>
  </DsfrModal>
</template>

<script setup lang="ts">
import { useExportState } from "~/composables/exportState"
import { downloadFromUrl } from "~/composables/utils"
import { useResourceStore } from "~/stores/resourceStore"
import { BASE_API_URL } from "~/composables/api"

const resourceStore = useResourceStore()

type StepChoice = "choice" | "print" | "JSON" | "files"

const emit = defineEmits(["close"])
const step = ref<StepChoice>("choice")
const { isExporting, selectedExport } = useExportState()

const selectedStepInput = ref<StepChoice>("print")
const exportInput = ref<string[]>([])

const onExportInput = () => {
  console.log("### input", Object.values(exportInput.value))
  selectedExport.value = Object.values(exportInput.value)
}

const options = [
  {
    label: "Impression (pdf)",
    hint: "Prêt à être imprimé",
    id: "print",
    value: "print",
    name: "choice",
  },
  {
    label: "Fichiers de la fiche",
    hint: "Tous les fichiers contenus dans la fiche au format zip",
    id: "files",
    value: "files",
    name: "choice",
  },
  {
    label: "JSON",
    hint: "Toutes les données au format JSON",
    id: "JSON",
    value: "JSON",
    name: "choice",
  },
]

const printOptions = [
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
  let toReturn = []
  if (step.value === "choice") {
    if (selectedStepInput.value === "print") {
      toReturn.push({
        label: "Suivant",
        onClick: () => {
          step.value = "print"
        },
      })
    } else {
      toReturn.push({
        label: "Télécharger",
        icon: "ri-download-line",
        onClick: () => {
          if (selectedStepInput.value === "JSON") {
            downloadFromUrl(
              `${BASE_API_URL}/api/resources/${resourceStore.currentId}/`,
              `${resourceStore.current.id} - ${resourceStore.current.title}.json`
            )
          } else if (selectedStepInput.value === "files") {
            downloadFromUrl(
              `${BASE_API_URL}/api/resources/${resourceStore.currentId}/files/`,
              `${resourceStore.current.title} - fichiers.zip`
            )
            emit("close")
          }
        },
      })
    }
  } else if (step.value === "print") {
    toReturn.push({
      label: "Afficher la version pour impression",
      onClick: () => {
        isExporting.value = true
        emit("close")
      },
      disabled: selectedExport.value.length === 0,
    })
  }

  toReturn.push({
    label: "Fermer",
    onClick: () => {
      emit("close")
      isExporting.value = false
    },
    secondary: true,
  })

  return toReturn
})
</script>
