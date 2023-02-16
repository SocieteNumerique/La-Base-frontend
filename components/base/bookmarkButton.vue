<template>
  <IntroTooltip slug="BASE_ADD_TO_BOOKMARKS" style="display: inline-block">
    <DsfrButton
      v-if="userStore.isLoggedIn"
      class="fr-btn--sm fr-btn--tertiary-no-outline"
      :title="title"
      :aria-pressed="isBookmared"
      :aria-label="ariaLabel"
      style="padding: 5px"
      @click="toggleBookmark"
    >
      <VIcon :name="icon" scale="1.25" />
    </DsfrButton>
  </IntroTooltip>
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
  return isBookmared.value ? "Retirer des favoris" : "Ajouter aux favoris"
})
const ariaLabel = computed<string>(() => {
  return isBookmared.value
    ? "Cliquer pour retirer la base aux favoris"
    : "Cliquer pour ajouter la base des favoris"
})
</script>
