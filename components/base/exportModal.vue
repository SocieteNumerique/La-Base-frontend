<template>
  <DsfrModal
    :opened="true"
    title="Exporter la base"
    :actions="actions"
    @close="$emit('close')"
  >
    Vous pouvez télécharger toutes les données de la base au format JSON. Plus
    d’informations sur ce format ici.
  </DsfrModal>
</template>

<script setup lang="ts">
import { downloadFromUrl } from "~/composables/utils"
import { useBaseStore } from "~/stores/baseStore"
import { BASE_API_URL } from "~/composables/api"
import { useRoute } from "vue-router"
import { useAlertStore } from "~/stores/alertStore"

const baseStore = useBaseStore()
const alertStore = useAlertStore()
const route = useRoute()

console.log("### route params", route.params)

const baseId = parseInt(<string>route.params.id)
const baseName = baseStore.basesById[baseId].title

const emit = defineEmits(["close"])

const actions = [
  {
    label: "Télécharger",
    icon: "ri-download-line",
    onClick: () => {
      console.log("### download", baseId, baseName)
      downloadFromUrl(
        `${BASE_API_URL}/api/bases/${baseId}/full/`,
        `${baseName}.json`
      )
      alertStore.alert("Téléchargement en cours", "", "success")
      emit("close")
    },
  },
]
</script>
