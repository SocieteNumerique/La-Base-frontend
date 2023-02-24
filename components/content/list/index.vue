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
          @click="toggleIsSectionFoldedToggle(section.id)"
        >
          <span v-if="!isSectionFoldedGetter(section.id)">
            <VIcon name="ri-arrow-up-s-line" /> Fermer
          </span>
          <span v-if="isSectionFoldedGetter(section.id)">
            <VIcon name="ri-arrow-down-s-line" /> Ouvrir
          </span>
        </button>
      </div>
      <ul
        :class="
          section.isFoldable && isSectionFoldedGetter(section.id)
            ? '-folded'
            : ''
        "
        class="hide-if-folded"
      >
        <li
          v-for="(content, index) of section.contents"
          :key="content.id"
          class="with-separation"
          :class="index === 0 ? 'first-content' : ''"
        >
          <ContentDisplay
            :content="content"
            :is-editing-view="false"
            class="fr-p-2w"
          />
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
const isSectionFoldedGetter = (id: number): boolean =>
  isSectionFoldedById.value[id] == null ? true : !!isSectionFoldedById.value[id]
const toggleIsSectionFoldedToggle = (id: number): boolean =>
  (isSectionFoldedById.value[id] = !isSectionFoldedGetter(id))
</script>

<style lang="sass" scoped>
ul
  list-style: none
  padding: 0
  .with-separation
    &::before, &::after
      content: ""
      border-top: 1px solid var(--border-default-grey)
      width: 100%
      display: none
      margin: 0.5rem 0
    &:first-of-type::before, &::after
      display: block
    &.first-content::before
      display: none !important
</style>
