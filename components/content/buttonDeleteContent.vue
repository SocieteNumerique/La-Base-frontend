<template>
  <button class="fr-btn--tertiary-no-outline" @click="ongoingDeletion = true">
    <VIcon name="ri-delete-bin-line" />
    {{ full ? "Supprimer" : "" }}
  </button>
  <DsfrModal
    v-if="ongoingDeletion"
    :actions="actions"
    :opened="true"
    title="Supprimer le contenu"
    @close="ongoingDeletion = false"
  >
    Confirmez-vous la suppression de ce contenu ? <br />
    Cette opération est irréversible.
  </DsfrModal>
</template>

<script lang="ts" setup>
const emits = defineEmits(["delete"])
defineProps({
  full: { type: Boolean, default: false },
})

const ongoingDeletion = ref<boolean>(false)
const actions = [
  {
    label: "Oui",
    onClick: () => {
      emits("delete")
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
