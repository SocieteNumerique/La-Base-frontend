<template>
  <DsfrModal
    :actions="actions"
    :opened="!modalTab.length"
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

    <BaseEditSectionMiniature
      v-for="sectionId of base.sections"
      :id="sectionId"
      :key="sectionId"
      @edit="onEditSection(sectionId)"
      @delete="onDeleteSection(sectionId)"
    />

    <DsfrButton
      primary
      icon="ri-add-line"
      class="fr-btn fr-btn--sm"
      @click="onAddSection()"
    >
      Ajouter une rubrique</DsfrButton
    >
  </DsfrModal>

  <BaseEditSectionAddEdit
    v-if="modalTab === 'edit'"
    :id="currentSectionId"
    @close="closeTab()"
  />
  <BaseEditSectionDelete
    v-else-if="modalTab === 'delete'"
    :id="currentSectionId"
    @close="closeTab()"
  />
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { Base, BaseCreate } from "~/composables/types"
import { computed } from "vue"
import { useRoute } from "vue-router"
import { DsfrButton } from "@gouvminint/vue-dsfr"
import DsfrModal from "~/components/DsfrResizableModal.vue"

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

const modalTab = ref<"" | "edit" | "delete">("")
const currentSectionId = ref<number | undefined>(undefined)

const onAddSection = () => {
  modalTab.value = "edit"
}
const onEditSection = (sectionId: number) => {
  modalTab.value = "edit"
  currentSectionId.value = sectionId
}
const onDeleteSection = (sectionId: number) => {
  modalTab.value = "delete"
  currentSectionId.value = sectionId
}
const closeTab = () => {
  modalTab.value = ""
  currentSectionId.value = undefined
}

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

const addSectionModalActions = computed(() => [
  {
    label: "Ajouter",
    onClick: () => {},
    disabled: false,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: closeTab,
  },
])
</script>

<style lang="sass"></style>
