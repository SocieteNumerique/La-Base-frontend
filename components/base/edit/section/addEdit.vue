<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    :title="modalTitle"
    @close="onClose()"
  >
    <DsfrInputGroup
      v-model="v$.title.$model"
      label="Nom de la rubrique"
      placeholder="Nom de la rubrique"
      hint="Requis: 100 caractères maximum"
      :label-visible="true"
      :required="true"
      :error-message="validationMessageFromErrors(v$.title.$errors)"
      :is-invalid="v$.title.$error"
    />

    <DsfrInputGroup
      v-model="v$.description.$model"
      label="Description de la rubrique"
      placeholder="Description de la rubrique"
      hint="Requis: 240 caractères maximum"
      :label-visible="true"
      :is-textarea="true"
      :required="true"
      class="fr-mt-4w"
      :error-message="validationMessageFromErrors(v$.description.$errors)"
      :is-invalid="v$.description.$error"
    />

    <DsfrRadioButtonSet
      v-model="v$.type.$model"
      :label-visible="true"
      legend="Type de rubrique"
      name="sectionType"
      :inline="true"
      :options="typeOptions"
      :required="true"
      class="fr-mb-4w type-radios"
      :error-message="validationMessageFromErrors(v$.type.$errors)"
      :is-invalid="v$.type.$error"
    />

    <ResourceSelector
      v-if="section.type === BaseSectionType.RESOURCES"
      v-model="v$.resources.$model"
      :base-id="baseId"
      label="Ajouter des fiches à la rubrique"
      placeholder="Rechercher dans les ressources de la base"
      :error-message="validationMessageFromErrors(v$.resources.$errors)"
    />
    <CollectionSelector
      v-if="section.type === BaseSectionType.COLLECTIONS"
      v-model="v$.collections.$model"
      :base-id="baseId"
      label="Ajouter des collections à la rubrique"
      placeholder="Rechercher dans les collections de la base"
      :error-message="validationMessageFromErrors(v$.collections.$errors)"
      :is-invalid="v$.collections.$error"
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
import { maxLength, required, requiredIf, sameAs } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"
import { validationMessageFromErrors } from "~/composables/validation"

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

const MAX_ELEMENTS_BY_SECTION = 15
const sectionRules = {
  title: { required },
  description: { required },
  type: { required },
  resources: {
    resourceRequired: requiredIf(
      () => section.value.type === BaseSectionType.RESOURCES
    ),
    maxLengthList: maxLength(MAX_ELEMENTS_BY_SECTION),
  },
  collections: {
    collectionRequired: requiredIf(
      () => section.value.type === BaseSectionType.COLLECTIONS
    ),
    maxLengthList: maxLength(MAX_ELEMENTS_BY_SECTION),
  },
}
const v$ = useVuelidate(sectionRules, section)

const actions = computed(() => [
  {
    label: isEditing ? "Modifier" : "Ajouter",
    onClick: () => {
      cleanOtherType()
      baseSectionStore.save(section.value)
      onClose()
    },
    disabled: v$.value.$invalid,
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
