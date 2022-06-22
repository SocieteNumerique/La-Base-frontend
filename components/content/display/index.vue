<template>
  <div class="content-display-container">
    <h5 v-if="content.title">{{ content.title }}</h5>
    <component
      :is="component"
      :content="content"
      :is-editing-view="isEditingView"
      :is-grid-view="isGridView"
      class="fr-text--sm"
    />
    <div v-if="content.annotation" class="fr-text--xs fr-my-2w">
      {{ content.annotation }}
    </div>
    <DsfrTag v-if="content.licence" :label="content.licence" :small="true" />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Content } from "~/composables/types"
import ContentDisplayText from "~/components/content/display/text.vue"
import ContentDisplayLink from "~/components/content/display/link.vue"
import ContentDisplayFile from "~/components/content/display/file.vue"
import ContentDisplayLinkedResource from "~/components/content/display/linkedResource.vue"

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
</script>

<style lang="sass" scoped>
.content-display-container
  overflow: hidden
</style>
