<template>
  <button
    :class="{ '-active': !isGridView, '-inactive': isGridView }"
    class="fr-btn fr-btn--tertiary-no-outline btn-tab-activable"
    @click="isGridView = false"
  >
    Vue en liste
  </button>
  <button
    v-show="!isGridViewEnabled"
    class="fr-btn fr-btn--tertiary-no-outline -inactive"
    @click="isGridViewEnabled = true"
  >
    Ajouter une vue en grille
  </button>
  <button
    v-show="isGridViewEnabled"
    :class="{ '-active': isGridView, '-inactive': !isGridView }"
    class="fr-btn fr-btn--tertiary-no-outline btn-tab-activable"
    @click="isGridView = true"
  >
    Vue en grille
  </button>
  <button
    v-show="isGridViewEnabled"
    class="fr-btn fr-btn--tertiary-no-outline"
    @click="noGridViewAtAll"
  >
    X
  </button>
  <!-- close-line icon -->
</template>

<script lang="ts" setup>
import { useModel } from "~/composables/modelWrapper"

defineProps({
  modelValue: { type: Boolean, required: true },
  enabled: { type: Boolean, required: true },
})

defineEmits(["update:enabled"])

const isGridView = useModel<boolean>("modelValue")
const isGridViewEnabled = useModel<boolean>("enabled")

function noGridViewAtAll() {
  isGridViewEnabled.value = false
  isGridView.value = false
}
</script>

<style lang="sass" scoped>
.-inactive
  color: var(--text-disabled-grey)
</style>
