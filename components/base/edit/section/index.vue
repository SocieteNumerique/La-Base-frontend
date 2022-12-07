<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <p>
      Les galeries vous permettent de mettre en avant certaines ressources et
      collections dès l’accueil de votre base.
    </p>
    <div class="separator fr-my-1w" />

    <h2 class="fr-h6 fr-mb-2w">Les derniers ajouts</h2>

    <p class="fr-text--xs fr-text-mention--grey fr-mb-2w">
      Afficher automatiquement les trois dernières fiches ajoutées.
    </p>

    <DsfrRadioButtonSet
      v-model="base.showLatestAdditions"
      name="resourceStatus"
      :inline="true"
      :options="options"
      :required="true"
      class="fr-mb-2w"
    />

    <div class="separator fr-my-1w" />

    <!--    <h2 class="fr-h6 fr-mb-2w">Les ressources de la semaine</h2>-->

    <!--    <p class="fr-mb-2w">-->
    <!--      Retrouvez ici mes ressources favorites du moment, bonne lecture !-->
    <!--    </p>-->

    <DsfrButton
      primary
      icon="ri-add-line"
      class="fr-btn fr-btn--sm"
      @click="addSection()"
    >
      Ajouter une rubrique</DsfrButton
    >
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { Base, BaseCreate } from "~/composables/types"
import { computed } from "vue"
import { useRoute } from "vue-router"
import { DsfrButton } from "@gouvminint/vue-dsfr"

const baseStore = useBaseStore()
const route = useRoute()

const baseId = parseInt(<string>route.params.id)
const emits = defineEmits(["close", "save", "done"])

const modalTitle = "Rubriques à la une"

const base = ref<Base | BaseCreate>({
  ...baseStore.current,
})

const options = [
  { label: " Afficher les derniers ajouts", value: true },
  { label: "Ne pas afficher", value: false },
]

const showLatestAdditions = computed({
  get() {
    return Number(base?.showLatestAdditions)
  },
  set(newValue: number) {
    base.showLatestAdditions = newValue
  },
})

const addSection = () => {}

async function updateBase() {
  emits("save", base.value)
}

const actions = computed(() => [
  {
    label: "Valider",
    onClick: updateBase,
    disabled: false,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => emits("close"),
  },
])
</script>

<style lang="sass"></style>
