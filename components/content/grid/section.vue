<template>
  <div
    :class="section.isFoldable ? 'foldable-section' : ''"
    class="fr-mb-6w section"
  >
    <template v-if="section.isFoldable">
      <div class="header-section">
        <h3>{{ section.title }}</h3>
        <button
          class="fr-btn--tertiary-no-outline"
          @click="isFolded = !isFolded"
        >
          <span v-show="!isFolded">
            <VIcon name="ri-arrow-up-s-line" /> Fermer
          </span>
          <span v-show="isFolded">
            <VIcon name="ri-arrow-down-s-line" /> Ouvrir
          </span>
        </button>
      </div>
    </template>
    <div
      :class="section.isFoldable && isFolded ? '-folded' : ''"
      class="grid-container hide-if-folded"
      :style="introStore.current ? 'z-index: -1' : ''"
    >
      <ul ref="blockGridRef" class="grid content-grid">
        <li
          v-for="content of contents"
          :key="content.id"
          :style="{ 'grid-column': `span ${content.nbCol}` }"
          class="content-item with-grey-border-top"
        >
          <ContentDisplay :content="content" :is-grid-view="true" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Content, SectionWithContent } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"
import { useIntroStore } from "~/stores/introStore"

defineProps({
  modelValue: { type: Object as PropType<SectionWithContent>, required: true },
  editingContent: { type: Number, default: undefined },
})

const introStore = useIntroStore()
const section = useModel<SectionWithContent>("modelValue", { type: "object" })
const isFolded = ref<boolean>(true)

const contents = computed<Content[]>({
  get() {
    return section.value.contents
  },
  set(newValue) {
    section.value.contents = newValue
  },
})
</script>

<style>
.content-item p:not(.fr-tag):last-child {
  margin-bottom: 0 !important;
}
</style>

<style lang="sass" scoped>
.grid-container
  position: relative
  height: min-content
  overflow-x: hidden
  overflow-y: visible

  .grid
    height: 100%
    width: 100%
    display: grid
    grid-gap: 24px
    row-gap: 12px
    grid-template-columns: repeat(6, 1fr)
    z-index: -1

  .content-grid
    list-style-type: none
    padding: 0
    margin: 0

    li.content-item
      padding: 48px 8px
      text-overflow: ellipsis
      overflow-wrap: break-word
      max-width: 100%

      &.with-grey-border-top
        position: relative

        &:before
          position: absolute
          content: " "
          top: 0
          left: 0
          width: 100vw
          border: 1px var(--grey-925-125) solid
</style>
