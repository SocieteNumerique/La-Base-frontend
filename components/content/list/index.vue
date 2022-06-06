<template>
  <div>
    <div
      v-for="section of contentsBySection"
      :key="section.id"
      :class="section.isFoldable ? 'foldable-section' : ''"
      class="section"
    >
      <div v-if="section.isFoldable" class="header-section">
        <h3>{{ section.title }}</h3>
        <button
          class="fr-btn--tertiary-no-outline"
          @click="
            isSectionFoldedById[section.id] = !isSectionFoldedById[section.id]
          "
        >
          <span v-show="!isSectionFoldedById[section.id]">
            <VIcon name="ri-arrow-up-s-line" /> Fermer
          </span>
          <span v-show="isSectionFoldedById[section.id]">
            <VIcon name="ri-arrow-down-s-line" /> Ouvrir
          </span>
        </button>
      </div>
      <ul
        :class="isSectionFoldedById[section.id] ? '-folded' : ''"
        class="hide-if-folded"
      >
        <li
          v-for="content of section.contents"
          :key="content.id"
          class="fr-p-2w"
        >
          <ContentDisplay :content="content" :is-editing-view="false" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SectionWithContent } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"

defineProps({
  modelValue: {
    type: Object as PropType<SectionWithContent>,
    required: true,
  },
})

const contentsBySection = useModel<SectionWithContent[]>("modelValue", {
  type: "array",
})
const isSectionFoldedById = ref<{ [key: number]: boolean }>({})
</script>

<style lang="sass" scoped>
ul
  list-style: none
  padding: 0
</style>
