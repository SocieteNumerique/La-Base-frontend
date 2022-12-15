<template>
  <DsfrButton
    v-if="userStore.isLoggedIn"
    class="fr-btn--sm fr-btn--tertiary-no-outline"
    :title="title"
    :aria-pressed="isBookmared"
    :aria-label="title"
    style="padding: 5px"
    @click="toggleBookmark"
  >
    <VIcon :name="icon" scale="1.25" />
  </DsfrButton>
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

const toggleBookmark = () => baseStore.toggleBookmark(props.baseId)
const isBookmared = computed(() => baseStore.basesById[props.baseId].bookmarked)
const icon = computed<string>(() => {
  return isBookmared.value ? "ri-star-fill" : "ri-star-line"
})
const title = computed<string>(() => {
  return isBookmared.value ? "Ajoutée aux favoris" : "Ajouter aux favoris"
})
</script>
