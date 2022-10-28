<template>
  <div class="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
    <button
      :class="{ '-active': !isGridView, '-inactive': isGridView }"
      class="fr-btn fr-btn--tertiary-no-outline btn-tab-activable fr-text--regular"
      @click="isGridView = false"
    >
      <VIcon class="fr-mr-2v" name="ri-align-left" />
      Vue en liste
    </button>
    <button
      v-if="isEditingMode"
      v-show="!isGridViewEnabled"
      class="fr-btn fr-btn--tertiary-no-outline -inactive fr-text--regular"
      @click="isGridViewEnabled = true"
    >
      <VIcon class="fr-mr-2v" name="ri-add-line" />
      Ajouter une vue en grille
    </button>
    <button
      v-show="isGridViewEnabled"
      :class="{ '-active': isGridView, '-inactive': !isGridView }"
      class="fr-btn fr-btn--tertiary-no-outline btn-tab-activable fr-text--regular"
      @click="isGridView = true"
    >
      <VIcon class="fr-mr-2v" name="ri-grid-line" />
      Vue en grille
    </button>
    <button
      v-if="isEditingMode"
      v-show="isGridViewEnabled && isGridView"
      class="fr-btn fr-btn--tertiary-no-outline fr-text--regular"
      @click="noGridViewAtAll"
    >
      <VIcon name="ri-close-line" />
    </button>
    <!-- close-line icon -->
  </div>
</template>

<script lang="ts" setup>
import { useModel } from "~/composables/modelWrapper"
import { useResourceStore } from "~/stores/resourceStore"

defineProps({
  modelValue: { type: Boolean, required: true },
  isEditingMode: { type: Boolean, default: false },
})

const resourceStore = useResourceStore()

const isGridView = useModel<boolean>("modelValue")

const isGridViewEnabled = computed<boolean>({
  get: () => resourceStore?.current?.isGridViewEnabled || false,
  set(value: boolean) {
    const resourceId = resourceStore?.currentId
    if (!resourceId) return
    resourceStore.setGridViewActivation(value, resourceId)
  },
})

function noGridViewAtAll() {
  isGridViewEnabled.value = false
  isGridView.value = false
}
</script>

<style lang="sass" scoped>
.-inactive
  color: var(--text-disabled-grey)
</style>
