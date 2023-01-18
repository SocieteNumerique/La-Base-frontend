<template>
  <div class="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
    <IntroTooltip slug="VIEW_LIST-GRID">
      <div>
        <button
          :class="{ '-active': !isGridView, '-inactive': isGridView }"
          class="fr-btn fr-btn--tertiary-no-outline btn-tab-activable fr-text--regular fr-m-0"
          @click="changeIsGridView(false)"
        >
          <VIcon class="fr-mr-2v" name="ri-align-left" />
          Vue en liste
        </button>
        <button
          v-if="isEditingMode && !isGridViewEnabled"
          class="fr-btn fr-btn--tertiary-no-outline -inactive fr-text--regular fr-mb-0"
          @click="isGridViewEnabled = true"
        >
          <VIcon class="fr-mr-2v" name="ri-add-line" />
          Ajouter une vue en grille
        </button>
        <button
          v-if="isGridViewEnabled"
          :class="{ '-active': isGridView, '-inactive': !isGridView }"
          class="fr-btn fr-btn--tertiary-no-outline btn-tab-activable fr-text--regular fr-mb-0"
          @click="changeIsGridView(true)"
        >
          <VIcon class="fr-mr-2v" name="ri-grid-line" />
          Vue en grille
        </button>
        <button
          v-if="isEditingMode && isGridViewEnabled && isGridView"
          class="fr-btn fr-btn--tertiary-no-outline fr-text--regular"
          @click="noGridViewAtAll"
        >
          <VIcon name="ri-close-line" />
        </button>
      </div>
    </IntroTooltip>
    <!-- close-line icon -->
  </div>
</template>

<script lang="ts" setup>
import { useModel } from "~/composables/modelWrapper"
import { useResourceStore } from "~/stores/resourceStore"
import { useIncrementRouterQuery } from "~/composables/incrementRouterQuery"

defineProps({
  modelValue: { type: Boolean, required: true },
  isEditingMode: { type: Boolean, default: false },
})

const resourceStore = useResourceStore()
const incrementRouterQuery = useIncrementRouterQuery()

const isGridView = useModel<boolean>("modelValue")

const isGridViewEnabled = computed<boolean>({
  get: () => resourceStore?.current?.isGridViewEnabled || false,
  set(value: boolean) {
    const resourceId = resourceStore?.currentId
    if (!resourceId) return
    resourceStore.setGridViewActivation(value, resourceId)
  },
})

const changeIsGridView = (view: boolean) => {
  incrementRouterQuery()
  isGridView.value = view
}

function noGridViewAtAll() {
  isGridViewEnabled.value = false
  isGridView.value = false
}
</script>

<style lang="sass" scoped>
.-inactive
  color: var(--text-disabled-grey)
</style>
