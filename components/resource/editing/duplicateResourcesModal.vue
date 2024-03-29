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
    <div class="resource-grid">
      <div
        v-for="resource of visibleResources"
        :key="resource.id"
        style="width: 330px"
      >
        <ResourceEditingDuplicateCancelMessageBlock
          v-if="ignoredDuplicates.includes(resource.id)"
          @cancel="ignoredDuplicates.pop(resource.id)"
        >
          <div class="fr-text--sm">
            Merci, cette fiche ne vous sera plus montrée comme doublon
          </div>
        </ResourceEditingDuplicateCancelMessageBlock>
        <ResourceEditingDuplicateCancelMessageBlock
          v-else-if="confirmedDuplicates.includes(resource.id)"
          @cancel="confirmedDuplicates.pop(resource.id)"
        >
          <div class="fr-text--sm">
            Si votre fiche ressemble trop à celle-ci, nous vous invitons à ne
            pas publier de doublon.
            <br /><br />
            Si vous souhaitez faire des suggestions, contribuer ou récupérer
            l’administration de la fiche, cliquez sur le bouton “contribuer”
            dans la fiche en question.
          </div>
        </ResourceEditingDuplicateCancelMessageBlock>
        <div
          v-else
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
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
            class="fr-btns-group--sm"
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
    .markDuplicates(
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
