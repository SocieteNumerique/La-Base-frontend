<template>
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

  <DsfrButton
    primary
    icon="ri-add-line"
    class="fr-btn fr-btn--sm"
    @click="addSection()"
  >
    Ajouter une rubrique</DsfrButton
  >
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { Base, BaseCreate, User } from "~/composables/types"
import { computed, PropType } from "vue"
import { useRoute } from "vue-router"
import { DsfrButton } from "@gouvminint/vue-dsfr"

const baseStore = useBaseStore()
const route = useRoute()

const baseId = parseInt(<string>route.params.id)

const props = defineProps({
  modelValue: { type: Object as PropType<Base | BaseCreate> },
})

defineEmits(["update:modelValue"])

const base = useModel<User[]>("modelValue", {
  type: "object",
})

const options = [
  { label: " Afficher les derniers ajouts", value: true },
  { label: "Ne pas afficher", value: false },
]

const addSection = () => {}
</script>

<style lang="sass"></style>
