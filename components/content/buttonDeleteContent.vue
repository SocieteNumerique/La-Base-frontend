<template>
  <button
    class="fr-btn--tertiary-no-outline fr-pb-1v"
    @click="ongoingDeletion = true"
  >
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
    <p>
      Confirmez-vous la suppression de ce contenu ? <br />
      Cette opération est irréversible.
    </p>
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
