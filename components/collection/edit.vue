<template>
  <DsfrModal
    :actions="settingsActions"
    :opened="step === 'init'"
    :title="`${isNew ? 'Ajouter' : 'Éditer'} une collection`"
    @close="onClose"
  >
    <DsfrInput
      v-model="collection.name"
      :label-visible="true"
      autofocus
      hint="max 100 caractères"
      label="Nom de la collection"
      maxlength="100"
      @input="isDirty = true"
    />
    <div class="btn-group fr-mt-4w">
      <DsfrButton :secondary="true" class="fr-mr-4w" @click="toStep('adding')">
        Ajouter des fiches à la collection
      </DsfrButton>

      <DsfrButton v-if="!isNew" class="btn-alert" @click="toStep('delete')">
        Supprimer
      </DsfrButton>
    </div>
  </DsfrModal>
  <DsfrModal
    :actions="addingActions"
    :opened="step === 'adding'"
    title="Ajouter des fiches à la collection"
    @close="onClose"
  >
    <ResourceSelector
      v-model="collection.resources"
      :base-id="collection.base"
      label="Appliquer à"
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
  </DsfrModal>
</template>

<script lang="ts" setup>
import { DsfrButton, DsfrInput } from "@laruiss/vue-dsfr"
import { PropType } from "vue"
import { Collection } from "~/composables/types"
import { useCollectionStore } from "~/stores/collectionStore"

const collectionStore = useCollectionStore()

const emits = defineEmits(["exit", "new-collection", "discard"])
const props = defineProps({
  isNew: { type: Boolean, default: false },
  modelValue: { type: Object as PropType<Collection>, required: true },
})
const collection = useModel<Collection>("modelValue", { type: "object" })
const savedResources = ref<number[]>([...(collection.value?.resources || [])])
const artificialClose = ref<boolean>(false)
const step = ref<string>("init")
const isDirty = ref<boolean>(false)
const isDirtyResources = ref<boolean>(false)

async function save() {
  if (props.isNew) {
    const createdCollection = await collectionStore.createCollection(
      collection.value
    )
    if (createdCollection) emits("new-collection", createdCollection.id)
  } else await collectionStore.update(collection.value.id, collection.value)
  savedResources.value = collection.value.resources || []
  isDirty.value = false
  toStep("init")
  emits("exit")
}

function resetResources() {
  collection.value.resources = savedResources.value
  isDirtyResources.value = false
  toStep("init")
}

function discard() {
  emits("discard")
  isDirty.value = false
  exit()
}

async function deleteCollection() {
  await collectionStore.delete(collection.value.id)
  exit()
}

function toStep(newStep: string) {
  artificialClose.value = true
  step.value = newStep
}

function onClose() {
  if (artificialClose.value) return (artificialClose.value = false)
  if (step.value === "init") {
    isDirty.value ? toStep("discard") : discard()
  } else if (step.value === "adding") {
    if (isDirtyResources.value) toStep("discard")
    else toStep("init")
  } else if (step.value === "discard") {
    if (isDirtyResources.value) resetResources()
    else discard()
  } else if (step.value === "delete") discard()
  artificialClose.value = false
}

function exit() {
  emits("exit")
  toStep("init")
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

const addingActions = [
  {
    label: "Valider",
    onClick() {
      savedResources.value = collection.value.resources || []
      isDirtyResources.value = false
      toStep("init")
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
      toStep("init")
    },
    secondary: true,
  },
]
</script>
