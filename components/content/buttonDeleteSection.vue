<template>
  <button
    class="fr-btn--tertiary-no-outline"
    v-bind="$attrs"
    @click="ongoingDeletion = true"
  >
    <VIcon name="ri-delete-bin-line" />
    Supprimer
  </button>
  <DsfrModal
    v-if="ongoingDeletion"
    :actions="actions"
    :opened="true"
    title="Supprimer la section"
    @close="ongoingDeletion = false"
  >
    Confirmez-vous la suppression de la section ? <br />
    Tous les contenus de la section seront supprimés avec elle.
  </DsfrModal>
</template>

<script lang="ts" setup>
const emits = defineEmits(["delete-section"])

const ongoingDeletion = ref<boolean>(false)
const actions = [
  {
    label: "Oui",
    onClick: () => {
      emits("delete-section")
      ongoingDeletion.value = false
    },
  },
  {
    label: "Non",
    secondary: true,
    onClick: () => (ongoingDeletion.value = false),
  },
]
</script>
