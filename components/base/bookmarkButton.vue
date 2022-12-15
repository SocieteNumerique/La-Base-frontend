<template>
  <DsfrButton
    v-if="userStore.isLoggedIn"
    label=""
    :icon="icon"
    class="fr-btn--sm fr-btn--tertiary-no-outline"
    :title="title"
    @click="toggleBookmark"
  />
</template>

<script setup lang="ts">
import { useBaseStore } from "~/stores/baseStore"
import { computed } from "vue"
import { useUserStore } from "~/stores/userStore"

const props = defineProps({
  baseId: { type: Number, required: true },
})

const userStore = useUserStore()
const baseStore = useBaseStore()

const toggleBookmark = () => {
  baseStore.toggleBookmark(props.baseId)
}
const icon = computed<string>(() => {
  return baseStore.basesById[props.baseId].bookmarked
    ? "ri-star-fill"
    : "ri-star-line"
})
const title = computed<string>(() => {
  return baseStore.basesById[props.baseId].bookmarked
    ? "Ajoutée aux favoris"
    : "Ajouter aux favoris"
})
</script>
