<template>
  <DsfrModal
    :actions="settingsActions"
    :opened="step === 'general'"
    :title="`${isNew ? 'Ajouter' : 'Éditer'} une collection`"
    @close="onClose"
  >
    <p>Une collection permet de regrouper des fiches ressources.</p>
    <div class="form-with-margins">
      <DsfrInputGroup
        v-model="tempCollection.name"
        :label-visible="true"
        autofocus
        :hint="`${tempCollection.name?.length || 0} / 100 caractères`"
        label="Nom de la collection"
        placeholder="Nom"
        maxlength="100"
        @input="isDirty = true"
      />
      <DsfrInputGroup
        v-model="tempCollection.description"
        :label-visible="true"
        autofocus
        :hint="`${tempCollection.description?.length || 0} / 100 caractères`"
        label="Description de la collection"
        placeholder="Description"
        maxlength="100"
      />

      <ImageResizableUpload
        v-model="tempCollection.profileImage"
        :label="`${
          tempCollection?.profileImage?.image ? 'Changer l\'' : 'Ajouter une '
        }image de miniature`"
        :desired-ratio="1.7"
        hint="Taille maximale : 15 Mo. Formats supportés : jpg, pdf, png."
        class="fr-mt-2w"
      />
    </div>

    <div class="btn-group fr-btns-group--sm fr-mt-4w">
      <DsfrButton v-if="!isNew" class="btn-alert" @click="toStep('delete')">
        Supprimer la collection
      </DsfrButton>
    </div>
  </DsfrModal>
  <DsfrModal
    :actions="resourcesActions"
    :opened="step === 'resources'"
    title="Gérer les fiches de la collection"
    @close="onClose"
  >
    <p>
      Sélectionnez dans la liste ci-dessous les ressources que vous voulez
      ajouter à votre collection.
    </p>
    <ResourceSelector
      v-model="tempCollection.resources"
      :base-id="collection.base"
      label="Ajouter des fiches à la collection :"
      placeholder="Rechercher dans les ressources de la base"
      @update:model-value="isDirtyResources = true"
    />
  </DsfrModal>
  <DsfrModal
    :actions="discardActions"
    :is-alert="true"
    :opened="step === 'discard'"
    title="Fermer sans enregistrer"
    @close="onClose"
  >
    Êtes-vous sûrs de vouloir fermer sans enregistrer ?
  </DsfrModal>
  <DsfrModal
    v-if="!isNew"
    :actions="deleteActions"
    :is-alert="true"
    :opened="step === 'delete'"
    title="Supprimer la collection"
    @close="onClose"
  >
    Êtes-vous sûr de vouloir supprimer cette collection ? Les fiches contenues
    dans la collection ne seront pas supprimées.
  </DsfrModal>
</template>

<script lang="ts" setup>
import { DsfrButton, DsfrInput } from "@gouvminint/vue-dsfr"
import { onMounted, PropType } from "vue"
import { Collection } from "~/composables/types"
import { useCollectionStore } from "~/stores/collectionStore"

const collectionStore = useCollectionStore()

const emits = defineEmits(["exit", "new-collection", "discard"])
const props = defineProps({
  isNew: { type: Boolean, default: false },
  collection: { type: Object as PropType<Collection>, required: true },
  tab: {
    type: String as PropType<"general" | "resources">,
    required: true,
  },
})
const savedResources = ref<number[]>([...(props.collection?.resources || [])])
const tempCollection = ref<Collection>({ ...props.collection }) // collection data until it is saved
const artificialClose = ref<boolean>(false)
const isDirty = ref<boolean>(false)
const step = ref<string>(props.tab || "general")
const isDirtyResources = ref<boolean>(false)

async function save() {
  if (props.isNew) {
    const createdCollection = await collectionStore.createCollection(
      tempCollection.value
    )
    if (createdCollection) emits("new-collection", createdCollection.id)
  } else await collectionStore.update(props.collection.id, tempCollection.value)
  savedResources.value = tempCollection.value.resources || []
  isDirty.value = false
  toStep("general")
  emits("exit")
}

function resetResources() {
  tempCollection.value.resources = savedResources.value
  isDirtyResources.value = false
  toStep("general")
}

function discard() {
  tempCollection.value = { ...props.collection }
  isDirty.value = false
  exit()
}

async function deleteCollection() {
  await collectionStore.delete(props.collection.id)
  exit()
}

function toStep(newStep: string) {
  artificialClose.value = true
  step.value = newStep
}

function onClose() {
  if (artificialClose.value) return (artificialClose.value = false)
  if (step.value === "general") {
    isDirty.value ? toStep("discard") : discard()
  } else if (step.value === "resources") {
    if (isDirtyResources.value) toStep("discard")
    else discard()
  } else if (step.value === "discard") {
    if (isDirtyResources.value) resetResources()
    else discard()
  } else if (step.value === "delete") discard()
  artificialClose.value = false
}

function exit() {
  emits("exit")
  toStep("general")
}

const settingsActions = ref<any[]>([
  {
    label: "Enregistrer",
    onClick() {
      save()
    },
  },
])
if (!props.isNew)
  settingsActions.value.push({
    label: "Annuler",
    secondary: true,
    onClick: () => toStep("discard"),
  })

const resourcesActions = [
  {
    label: "Valider",
    onClick() {
      savedResources.value = tempCollection.value.resources || []
      isDirtyResources.value = false
      save()
    },
  },
]

const discardActions = [
  {
    label: "Enregistrer",
    onClick() {
      save()
    },
  },
]

const deleteActions = [
  {
    label: "Supprimer",
    onClick() {
      deleteCollection()
    },
  },
  {
    label: "Annuler",
    onClick() {
      toStep("general")
    },
    secondary: true,
  },
]
</script>
