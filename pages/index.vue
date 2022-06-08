<template>
  <div>
    <h1 class="fr-mt-4w">Accueil</h1>
    <h2 class="fr-mt-5w">Mes bases</h2>
    <DsfrButton label="Créer une base" @click="showAddModal" />
    <div class="is-flex fr-mb-4w bases-holder">
      <BaseMiniature
        v-for="baseId of baseStore.basesOrder"
        :key="baseId"
        :base="baseStore.basesById[baseId]"
      />
    </div>
    <DsfrModal
      :actions="addActions"
      title="Ajouter une base"
      :opened="showAddBaseModal"
      @close="showAddBaseModal = false"
    >
      <DsfrInput
        id="newBaseTitle"
        :model-value="newBaseTitle"
        label="Nom de la base"
        hint="max 100 caractères"
        maxlength="100"
        :label-visible="true"
        autofocus
        @update:model-value="onBaseTitleUpdate"
      />
    </DsfrModal>
  </div>
</template>

<script setup lang="ts">
import { useBaseStore } from "~/stores/baseStore"
import { DsfrButton, DsfrInput, DsfrModal } from "@laruiss/vue-dsfr"

const baseStore = useBaseStore()

const showAddBaseModal = ref(false)
const newBaseTitle = ref("")

const showAddModal = () => {
  showAddBaseModal.value = true
  setTimeout(() => {
    const el = document.getElementById("newBaseTitle")
    if (el) {
      el.focus()
    }
  }, 200)
}
const createBase = () => {
  baseStore.createBase(newBaseTitle.value)
}

const addActions = computed(() => [
  {
    label: "Valider",
    onClick: createBase,
    disabled: newBaseTitle.value.length === 0,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => (showAddBaseModal.value = false),
  },
])
const onBaseTitleUpdate = (value: string) => (newBaseTitle.value = value)
</script>

<style>
.bases-holder {
  flex-wrap: wrap;
  margin-left: -16px;
}
.bases-holder > * {
  margin-left: 16px;
  margin-top: 24px;
}
</style>
