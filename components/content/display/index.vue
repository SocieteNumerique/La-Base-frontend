<template>
  <div class="content-display-container">
    <h4 v-if="content.title" class="fr-h6">{{ content.title }}</h4>
    <component
      :is="component"
      :content="content"
      :is-editing-view="isEditingView"
      :is-grid-view="isGridView"
      class="fr-text--sm fr-mb-2w"
    />
    <div v-if="content.annotation" class="fr-text--sm fr-mt-0">
      {{ content.annotation }}
    </div>
    <div
      v-if="!content.useResourceLicenseAndAccess"
      class="license-access-grid fr-text--xs fr-mt-3w"
    >
      <template v-if="accessPriceTags.length">
        <span>Prix et accès</span>
        <div class="license-tag-rows is-flex fr-mb-n1w">
          <DsfrTags :tags="accessPriceTags" /></div
      ></template>
      <template v-if="licenseTags.length">
        <span>Licence</span>
        <TagDisplayRowLicense
          :tags="licenseTags"
          :license-text="content.licenseText"
          class="fr-mb-n1w"
      /></template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Content } from "~/composables/types"
import ContentDisplayText from "~/components/content/display/text.vue"
import ContentDisplayLink from "~/components/content/display/link.vue"
import ContentDisplayFile from "~/components/content/display/file.vue"
import ContentDisplayLinkedResource from "~/components/content/display/linkedResource.vue"
import { useTagStore } from "~/stores/tagStore"

const tagStore = useTagStore()

const props = defineProps({
  content: { type: Object as PropType<Content>, required: true },
  isEditingView: { type: Boolean, default: false },
  isGridView: { type: Boolean, default: false },
})

const componentByType: { [key: string]: unknown } = {
  text: ContentDisplayText,
  link: ContentDisplayLink,
  file: ContentDisplayFile,
  linkedResource: ContentDisplayLinkedResource,
}
const component = computed(() => componentByType[props.content.type])

const licenseTags = computed<{ label: string }[]>(() =>
  props.content
    .licenseTags!.map((tagId) => tagStore.tagsById[tagId])
    .filter((tag) => tag !== undefined)
    .map((tag) => ({ label: tag.name, small: true }))
)
const accessPriceTags = computed<{ label: string }[]>(() =>
  props.content
    .accessPriceTags!.map((tagId) => tagStore.tagsById[tagId])
    .filter((tag) => tag !== undefined)
    .map((tag) => ({ label: tag.name, small: true }))
)
</script>

<style lang="sass" scoped>
.content-display-container
  overflow: hidden

.license-access-grid
  display: grid
  grid-template-columns: fit-content(200px) auto
  column-gap: 24px
  margin: 0
  align-items: center
  span
    padding-top: 4px
    padding-bottom: 4px
</style>
