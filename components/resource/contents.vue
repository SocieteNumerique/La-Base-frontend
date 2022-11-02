<template>
  <div>
    <ContentGridViewSwitcher
      v-if="isGridViewEnabled"
      v-model="isGridView"
      class="fr-mb-3w"
    />
    <ContentList
      v-show="!(isGridView && isGridViewEnabled)"
      v-model="contentsBySection"
    />
    <ContentGrid
      v-if="isGridView && isGridViewEnabled"
      v-model="contentsBySection"
    />
  </div>
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"
import { SectionWithContent } from "~/composables/types"
import {
  getResourceContentsBySection,
  emptyContentBySection,
} from "~/composables/contentsHelper"

const resourceStore = useResourceStore()

const isGridViewEnabled = computed<boolean>(() =>
  resourceStore.current?.isGridViewEnabled == null
    ? true
    : resourceStore.current.isGridViewEnabled
)
const isGridView = ref<boolean>(false) // TODO compute from resource?

const contentsBySection = ref<SectionWithContent[]>(
  (await getResourceContentsBySection(resourceStore.currentId!)) ||
    emptyContentBySection
)
</script>

<style lang="sass" scoped></style>
