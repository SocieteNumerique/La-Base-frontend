<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    :title="modalTitle"
    @close="onClose()"
  >
    <DsfrInput
      v-model="section.title"
      label="Nom de la rubrique"
      placeholder="Nom de la rubrique"
      hint="Requis: 100 caractères maximum"
      :label-visible="true"
      :required="true"
      class="fr-mb-4w"
    />

    <DsfrInput
      v-model="section.description"
      label="Description de la rubrique"
      placeholder="Description de la rubrique"
      hint="Requis: 240 caractères maximum"
      :label-visible="true"
      :is-textarea="true"
      :required="true"
      class="fr-mb-4w"
    />

    <DsfrRadioButtonSet
      v-model="section.type"
      :label-visible="true"
      legend="Type de rubrique"
      name="sectionType"
      :inline="true"
      :options="typeOptions"
      :required="true"
      class="fr-mb-4w type-radios"
    />

    <ResourceSelector
      v-if="section.type === BaseSectionType.RESOURCES"
      v-model="section.resources"
      :base-id="baseId"
      label="Ajouter des fiches à la rubrique"
      placeholder="Rechercher dans les ressources de la base"
    />
    <CollectionSelector
      v-if="section.type === BaseSectionType.COLLECTIONS"
      v-model="section.collections"
      :base-id="baseId"
      label="Ajouter des collections à la rubrique"
      placeholder="Rechercher dans les collections de la base"
    />
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { BaseSection, BaseSectionType } from "~/composables/types"
import { computed } from "vue"
import { useRoute } from "vue-router"
import DsfrModal from "~/components/DsfrResizableModal.vue"
import { useResourceStore } from "~/stores/resourceStore"
import { useBaseSectionStore } from "~/stores/baseSectionStore"
import { deepCopy } from "~/composables/utils"

const baseStore = useBaseStore()
const resourceStore = useResourceStore()
const baseSectionStore = useBaseSectionStore()
const route = useRoute()

const props = defineProps({
  id: {
    type: Number,
    default: undefined,
  },
})

const isEditing = Boolean(props.id)

const baseId = parseInt(<string>route.params.id)
const emits = defineEmits(["close", "save", "done"])
const section = ref<BaseSection>(
  isEditing
    ? deepCopy(baseSectionStore.baseSectionsById[props.id!])
    : {
        base: baseId,
        title: "",
        description: "",
        type: "resources",
        resources: [],
        collections: [],
      }
)

const modalTitle = isEditing ? "Modifier une rubrique" : "Ajouter une rubrique"

const onClose = () => {
  emits("close")
}

const cleanOtherType = () => {
  switch (section.value.type) {
    case BaseSectionType.RESOURCES:
      section.value.collections = []
      break
    case BaseSectionType.COLLECTIONS:
      section.value.resources = []
      break
  }
}
const typeOptions = [
  {
    label: "Fiche ressource",
    value: BaseSectionType.RESOURCES,
  },
  { label: "Collections", value: BaseSectionType.COLLECTIONS },
]
const actions = computed(() => [
  {
    label: isEditing ? "Modifier" : "Ajouter",
    onClick: () => {
      cleanOtherType()
      baseSectionStore.save(section.value)
      onClose()
    },
    disabled: false,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: onClose,
  },
])
</script>

<style lang="sass">
.type-radios
  legend
    font-weight: normal
</style>
