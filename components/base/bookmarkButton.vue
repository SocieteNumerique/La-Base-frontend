<template>
  <DsfrButton
    v-if="userStore.isLoggedIn"
    :label="bookmark.label"
    :icon="bookmark.icon"
    :class="bookmark.klass"
    class="fr-btn--sm"
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
const bookmark = computed<{ label: string; icon: string; klass: string }>(
  () => {
    let label = "Ajouter aux favoris"
    let icon = "ri-star-line"
    let klass = ""
    baseStore.basesById[props.baseId].bookmarked
    if (baseStore.basesById[props.baseId].bookmarked) {
      label = "Ajoutée aux favoris"
      icon = "ri-star-fill"
      klass = "fr-btn--secondary"
    }
    return {
      label,
      icon,
      klass,
    }
  }
)
</script>
