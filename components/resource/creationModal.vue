<template>
  <DsfrModal
    ref="modal"
    :opened="true"
    :actions="actions"
    title="Ajouter une ressource"
    @close="onClose()"
  >
    <template v-if="baseStore.hasBases">
      <BaseSelector
        v-if="!props.baseId"
        v-model="selectedBase"
        description="Publier dans"
      />
      <DsfrInput
        :model-value="title"
        label="Nom de la ressource"
        placeholder="Nom de la ressource"
        :label-visible="true"
        @update:model-value="onTitleUpdate"
      />
    </template>
    <template v-else>
      <p>
        Vous n'êtes propriétaire ou éditeur d'aucune base. Pour ajouter une
        ressource, vous devez d'abord
      </p>
      <p>
        <button class="fr-btn" @click="showAddBaseModal = true">
          Créer une base
        </button>
        <BaseEditGeneral
          v-if="showAddBaseModal"
          new
          @close="showAddBaseModal = false"
        />
      </p>
    </template>
  </DsfrModal>
</template>

<script setup lang="ts">
import BaseSelector from "~/components/baseSelector.vue"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useResourceStore } from "~/stores/resourceStore"
import { useBaseStore } from "~/stores/baseStore"
import { DsfrInput } from "@laruiss/vue-dsfr"

const resourceStore = useResourceStore()
const baseStore = useBaseStore()
const router = useRouter()
const emit = defineEmits(["close"])
const props = defineProps({
  baseId: { type: Number, default: undefined },
})

const title = ref("")
const showAddBaseModal = ref<boolean>(false)
const onClose = () => {
  emit("close")
}

const onTitleUpdate = (newTitle: string) => {
  title.value = newTitle
}

const selectedBase = ref<number | undefined>(props.baseId)
const createResource = async () => {
  const resource = await resourceStore.createResource({
    title: title.value,
    rootBase: selectedBase.value!,
  })

  if (resource) {
    await router.push(`/ressource/${resource.id}/edition`)
  }
}

const isCreateResourceDisabled = computed(() => {
  title.value
  selectedBase.value
  if (!title.value || title.value.length < 3) {
    return true
  }

  if (!selectedBase.value) {
    return true
  }

  // all good
  return false
})

const actions = computed(() => {
  title.value
  selectedBase.value

  return [
    {
      label: "Valider",
      onClick: createResource,
      disabled: isCreateResourceDisabled.value,
    },
    {
      label: "Annuler",
      secondary: true,
      onClick: onClose,
    },
  ]
})
</script>
