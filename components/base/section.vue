<template>
  <div>
    <hr class="fr-pb-4w fr-mt-4w" />
    <h2 class="fr-h3 fr-mb-2w">
      {{ section.title }}
    </h2>
    <p class="fr-mb-5w">
      {{ section.description }}
    </p>
    <div class="resource-grid">
      <template v-if="section.type === BaseSectionType.RESOURCES">
        <template v-for="resourceId in elements" :key="resourceId">
          <ResourceMiniatureById
            v-if="resourceStore.resourcesById[resourceId]"
            :resource-id="resourceId"
          />
        </template>
      </template>
      <template v-if="section.type === BaseSectionType.COLLECTIONS">
        <CollectionMiniatureById
          v-for="collectionId in elements"
          :key="collectionId"
          :collection-id="collectionId"
          :editable="editable"
        />
      </template>
    </div>
    <div
      v-if="section[section.type].length > 3"
      class="is-flex is-justify-flex-end"
    >
      <DsfrButton
        class="fr-btn--tertiary-no-outline fr-btn--sm"
        :label="showMore ? 'Voir moins' : 'Voir plus'"
        :icon="showMore ? 'ri-subtract-line' : 'ri-add-line'"
        @click="showMore = !showMore"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue"
import { BaseSection, BaseSectionType } from "~/composables/types"
import { DsfrButton } from "@gouvminint/vue-dsfr"
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()

const editable = useIsBaseEditable()

const props = defineProps({
  section: {
    type: Object as PropType<BaseSection>,
    required: true,
  },
})

const showMore = ref(false)

const elements = computed(() => {
  return showMore.value
    ? props.section[props.section.type]
    : props.section[props.section.type].slice(0, 3)
})

const onClickShowMore = () => {
  showMore.value = true
}
</script>

<style scoped></style>
