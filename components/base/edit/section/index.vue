<template>
  <DsfrModal
    v-if="!modalTab.length"
    :actions="actions"
    :opened="true"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <p>
      Les galeries vous permettent de mettre en avant certaines ressources et
      collections dès l’accueil de votre base.
    </p>
    <div class="separator fr-my-4w" />

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
    />

    <div class="separator fr-my-4w" />

    <div
      v-for="(sectionId, index) of baseStore.current.sections"
      :key="sectionId"
    >
      <div class="fr-mb-2w is-flex is-align-item-center">
        <h2 class="fr-h6 is-flex-grow fr-mb-0">
          {{ baseSectionStore.baseSectionsById[sectionId].title }}
        </h2>
        <div class="is-no-flex-shrink">
          <DsfrButtonGroup
            :buttons="getSectionButtons(sectionId, index)"
            :inline="true"
            class="fr-btns-group--sm"
            size="small"
          />
        </div>
      </div>

      <p class="fr-mb-4v">
        {{ baseSectionStore.baseSectionsById[sectionId].description }}
      </p>

      <div class="separator fr-my-4w" />
    </div>

    <DsfrButtonGroup
      :buttons="buttons"
      :inline="true"
      class="fr-mt-4w fr-btns-group--sm"
      size="small"
    />
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
import { DsfrButtonGroup } from "@gouvminint/vue-dsfr"
import DsfrModal from "~/components/DsfrResizableModal.vue"
import { useBaseSectionStore } from "~/stores/baseSectionStore"

const baseStore = useBaseStore()
const baseSectionStore = useBaseSectionStore()
const route = useRoute()

const baseId = parseInt(<string>route.params.id)
const emits = defineEmits(["close", "save", "done"])

const modalTitle = "Rubriques à la une"

const base = ref<Base | BaseCreate>({
  ...baseStore.current,
})
const ordering = ref(false)

const options = [
  { label: "Afficher les derniers ajouts", value: true },
  { label: "Ne pas afficher", value: false },
]

const modalTab = ref<"" | "edit" | "delete">("")
const currentSectionId = ref<number | undefined>(undefined)

const onAddSection = () => {
  modalTab.value = "edit"
}
const onOrderSection = () => {
  ordering.value = !ordering.value
}
const onEditSection = (sectionId: number) => {
  modalTab.value = "edit"
  currentSectionId.value = sectionId
}
const onDeleteSection = (sectionId: number) => {
  modalTab.value = "delete"
  currentSectionId.value = sectionId
}

const moveSection = (sectionIndex: number, move: number) => {
  baseSectionStore.moveSection(baseId, sectionIndex, sectionIndex + move)
}
const closeTab = () => {
  modalTab.value = ""
  currentSectionId.value = undefined
}

async function updateBase() {
  emits("save", base.value)
}

const getSectionButtons = (sectionId: number, index: number): any[] => {
  const commonClass = "fr-mb-0 fr-mr-0"
  if (ordering.value) {
    return [
      {
        label: "Vers le haut",
        icon: "ri-arrow-up-line",
        class: `fr-btn--tertiary-no-outline ${commonClass}`,
        onClick: () => {
          moveSection(index, -1)
        },
        active: index,
      },
      {
        label: "Vers le bas",
        icon: "ri-arrow-down-line",
        class: `fr-btn--tertiary-no-outline ${commonClass}`,
        onClick: () => {
          moveSection(index, 1)
        },
        active: index !== base.value.sections.length - 1,
      },
    ].filter((button) => button.active)
  }
  return [
    {
      label: "Supprimer",
      icon: "ri-delete-bin-line",
      class: `fr-btn--tertiary-no-outline ${commonClass}`,
      onClick: () => onDeleteSection(sectionId),
    },
    {
      label: "Modifier",
      icon: "ri-edit-line",
      class: `fr-btn--tertiary-no-outline ${commonClass}`,
      onClick: () => onEditSection(sectionId),
    },
  ]
}

const buttons = computed(() =>
  [
    {
      label: "Ajouter une rubrique",
      disabled: false,
      primary: true,
      icon: "ri-add-line",
      onClick: onAddSection,
      active: true,
    },
    {
      label: ordering.value
        ? "Arreter le changement d'ordre"
        : "Changer l'ordre des sections",
      secondary: true,
      onClick: onOrderSection,
      active: base.value.sections.length,
    },
  ].filter((button) => button.active)
)

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
