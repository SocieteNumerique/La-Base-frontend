<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    title="Le statut en consultation de la base"
    @close="$emit('close')"
  >
    <p>
      Paramétrer les droits de consultation de votre base<br />
      Vous pouvez modifier ces droits à tout moment.
    </p>
    <DsfrRadioButtonSet
      v-model="baseState"
      :inline="true"
      :options="options"
      :required="true"
      legend="Le statut de la base est"
      name="baseState"
      class="fr-mt-3w"
    />
    <p>{{ stateHint }}</p>
  </DsfrModal>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useBaseStore } from "~/stores/baseStore"

const emits = defineEmits(["close", "save"])
const baseStore = useBaseStore()
const baseState = ref<string>(baseStore.current.state || "private")

const hintByState: { [key: string]: string } = {
  public:
    "Cette base peut être consultée par tous les visiteurs, qu’ils disposent ou non d’un compte utilisateur. Elle ne peut cependant être modifiée que par les administrateurs et contributeurs.",
  private:
    "Cette base n’est accessible qu’aux administrateurs et contributeurs de votre base, ainsi qu’à un nombre réduit d’autres utilisateurs, sélectionnés par vous.",
  draft:
    "Cette base  n’est visible dans le moteur de recherche que par les administrateurs et contributeurs de votre base, ainsi qu’à un nombre réduit d’autres utilisateurs, sélectionnés par vous.",
}
const stateHint = computed<string>(() => hintByState[baseState.value] || "")

const options = [
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Privé",
    value: "private",
  },
  {
    label: "Invisible",
    value: "draft",
  },
]

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
