<template>
  <DsfrModal
    v-if="!confirmStep"
    class="red-modal"
    :actions="deleteActions"
    :opened="true"
    title="Supprimer la base"
    @close="$emit('close')"
  >
    Êtes-vous sûr de vouloir supprimer cette base ?
  </DsfrModal>

  <DsfrModal
    v-if="confirmStep"
    :actions="confirmActions"
    :opened="true"
    title="Supprimer la base"
    @close="$emit('close')"
  >
    Confirmez-vous la suppression de la base ? <br />
    Cette opération est irréversible.
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"

const baseStore = useBaseStore()
const emits = defineEmits(["close"])
const confirmStep = ref<boolean>(false)

const deleteActions = [
  {
    label: "Supprimer",
    icon: "ri-delete-bin-line",
    onClick() {
      confirmStep.value = true
    },
  },
]

const confirmActions = [
  {
    label: "Oui",
    onClick: async () => {
      const success = await baseStore.delete(baseStore.currentId!)
      if (success) useRouter().push("/")
    },
  },
  {
    label: "Non",
    secondary: true,
    onClick: () => emits("close"),
  },
]
</script>

<style lang="sass">
.fr-modal.red-modal .fr-modal__footer .fr-btn
  background-color: var(--background-flat-error)

  &:hover
    background-color: var(--background-action-high-error-hover)

  &:active
    background-color: var(--background-action-high-error-active)
</style>
