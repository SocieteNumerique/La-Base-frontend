<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    title="Le statut en consultation de la base"
    @close="$emit('close')"
  >
    <DsfrRadioButtonSet
      v-model="baseState"
      :inline="true"
      :options="options"
      :required="true"
      legend="Le statut de la base est"
      name="baseState"
    />
  </DsfrModal>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useBaseStore } from "~/stores/baseStore"

const emits = defineEmits(["close", "save"])
const baseStore = useBaseStore()
const baseState = ref<string>(baseStore.current.state || "private")

const options = computed(() => {
  return [
    {
      label: "Public",
      value: "public",
    },
    {
      label: "Privé",
      value: "private",
    },
    /*{
      label: "Brouillon",
      value: "draft",
    },*/
  ]
})

const actions = computed(() => [
  {
    label: "Valider",
    onClick: async () =>
      emits("save", {
        id: baseStore.currentId!,
        state: baseState.value,
      }),
    disabled: !baseState.value,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => {
      emits("close")
    },
  },
])
</script>

<style lang="sass" scoped></style>
