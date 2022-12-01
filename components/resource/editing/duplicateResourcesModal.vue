<template>
  <DsfrResizableModal
    :actions="actions"
    title="Vérifier les doublons"
    :opened="props.opened"
    modal-grid="fr-col-12 fr-col-md-10 fr-col-lg-8"
    @close="onClose()"
  >
    <p>
      La fiche que vous êtes en train de créer est similaire à d’autres fiches
      déjà publiées. Nous vous invitons à ne pas créer de doublon dans la mesure
      du possible.
    </p>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div
        v-for="resource of visibleResources"
        :key="resource.id"
        class="fr-col-md-6 fr-col-12"
      >
        <ResourceEditingDuplicateCancelMessageBlock
          v-if="ignoredDuplicates.includes(resource.id)"
          @cancel="ignoredDuplicates.pop(resource.id)"
        >
          Merci, cette fiche ne vous sera plus montrée comme doublon
        </ResourceEditingDuplicateCancelMessageBlock>
        <ResourceEditingDuplicateCancelMessageBlock
          v-else-if="confirmedDuplicates.includes(resource.id)"
          @cancel="confirmedDuplicates.pop(resource.id)"
        >
          Si votre fiche ressemble trop à celle-ci, nous vous invitons à ne pas
          publier de nouvelle fiche doublon.
          <br />
          <br />
          Si votre fiche est très similaire, nous vous invitons à abandonner la
          création.
          <br />
          <br />
          Vous pouvez contacter l’auteur de la fiche doublon via sa base si vous
          souhaitez lui faire des suggestions à propos de la fiche ressource.
        </ResourceEditingDuplicateCancelMessageBlock>
        <div v-else>
          <ResourceMiniature
            v-model="resource.pinnedInBases"
            :resource="resource"
            :show-toolbar="false"
            :new-tab="true"
          />
          <DsfrButtonGroup
            :buttons="getButtons(resource.id)"
            :inline="true"
            size="small"
          ></DsfrButtonGroup>
        </div>
      </div>
    </div>
  </DsfrResizableModal>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Resource } from "~/composables/types"
import { useResourceStore } from "~/stores/resourceStore"
import { DsfrButtonGroup } from "@gouvminint/vue-dsfr"

const resourceStore = useResourceStore()

const props = defineProps({
  opened: { type: Boolean, required: true },
  duplicateResourceIds: { type: Array as PropType<number[]>, required: true },
})
const emits = defineEmits(["next", "close"])

const RESOURCE_PER_PAGE = 2

const duplicateResources = ref<Resource[]>([])
const ignoredDuplicates = ref<number[]>([])
const confirmedDuplicates = ref<number[]>([])
const currentPage = ref<number>(0)
const pages = computed<number>(() => {
  return Math.ceil(props.duplicateResourceIds.length / RESOURCE_PER_PAGE)
})
const visibleResources = computed(() => {
  return duplicateResources.value.slice(
    currentPage.value * RESOURCE_PER_PAGE,
    (currentPage.value + 1) * RESOURCE_PER_PAGE
  )
})
const getDuplicatedResource = async () => {
  duplicateResources.value = []
  ignoredDuplicates.value = []
  confirmedDuplicates.value = []
  for (const resourceId of props.duplicateResourceIds) {
    if (!resourceStore.resourcesById[resourceId]) {
      await resourceStore.getResource(resourceId, true)
    }
    duplicateResources.value.push(resourceStore.resourcesById[resourceId])
  }
}
watch(
  () => props.duplicateResourceIds,
  () => getDuplicatedResource()
)

const getButtons = (resourceId: number) => {
  return [
    {
      label: "Ignorer",
      secondary: true,
      icon: "ri-close-line",
      onClick: () => {
        ignoredDuplicates.value.push(resourceId)
      },
    },
    {
      label: "C'est un doublon",
      icon: "ri-alert-line",
      secondary: true,
      class: "btn-alert",
      onClick: () => {
        confirmedDuplicates.value.push(resourceId)
      },
    },
  ]
}

const resetDuplicateAnswers = () => {
  ignoredDuplicates.value = []
  confirmedDuplicates.value = []
}

const onClose = () => {
  if (!ignoredDuplicates.value.length && !confirmedDuplicates.value.length) {
    resetDuplicateAnswers()
    emits("close")
    return
  }
  resourceStore
    .duplicateAnswer(
      resourceStore.current.id,
      ignoredDuplicates.value,
      confirmedDuplicates.value
    )
    .then(() => {
      resetDuplicateAnswers()
      emits("close")
    })
}
const actions = computed(() => {
  return [
    {
      label: "Suivant",
      onClick: () => {
        currentPage.value = currentPage.value + 1
      },
      primary: true,
      active: currentPage.value + 1 != pages.value,
    },
    {
      label: "Fermer",
      onClick: () => {
        onClose()
      },
      primary: true,
      active: currentPage.value + 1 == pages.value,
    },
    {
      label: "Précédent",
      onClick: () => {
        currentPage.value = currentPage.value - 1
      },
      disabled: currentPage.value == 0,
      tertiary: true,
      active: true,
    },
  ].filter((button) => button.active)
})
</script>
