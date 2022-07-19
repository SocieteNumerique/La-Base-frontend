<template>
  <DsfrModal
    :actions="discardActions"
    :is-alert="true"
    title="Fermer sans enregistrer"
    opened
    @close="$emit('close')"
  >
    Êtes-vous sûrs de vouloir fermer sans enregistrer ?
  </DsfrModal>
</template>

<script setup lang="ts">
const emits = defineEmits(["save", "exit", "back"])
const discardActions = [
  {
    label: "Enregistrer",
    onClick() {
      emits("save")
    },
  },
  {
    label: "Retour",
    onClick() {
      emits("back")
    },
    secondary: true,
  },
]
</script>
