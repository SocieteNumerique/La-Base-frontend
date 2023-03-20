<template>
  <NuxtLink
    v-if="resource?.title"
    :to="`/ressource/${content.linkedResource}`"
    class="no-underline no-append-ico"
    rel="noopener noreferrer"
    target="_blank"
  >
    <div class="link-preview fr-mb-2w">
      <div style="display: flex">
        <div class="fr-p-1w" style="flex-grow: 1">
          <p class="fr-text--bold fr-text--xs fr-m-0">
            {{ resource?.title }}
          </p>
          <p
            v-if="content.targetDescription"
            class="fr-text--xs fr-mt-1v fr-mb-0"
          >
            {{ limitedDescription(resource?.description) }}
          </p>
        </div>
        <div v-if="resource?.profileImage" class="fr-ml-1v right-image">
          <ImageResized
            :resizable-image="resource?.profileImage"
            :dimensions="{ width: '180px', height: '60px' }"
            format="miniature"
            default-image="resource"
          />
        </div>
        <div v-else class="right-image default-image">
          <VIcon
            scale="1.3"
            name="ri-link"
            color="var(--text-action-high-blue-france)"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
  <template v-else>
    <VIcon class="fr-mr-1w" name="ri-link" />
    <NuxtLink
      :to="`/ressource/${content.linkedResource}`"
      class="no-underline no-append-ico fr-text-title--blue-france"
      rel="noopener noreferrer"
      target="_blank"
    >
      Ouvrir
    </NuxtLink>
  </template>
</template>

<script lang="ts" setup>
import { LinkedResourceContent, Resource } from "~/composables/types"
import { PropType } from "vue"
import { useResourceStore } from "~/stores/resourceStore"
import { limitedDescription } from "~/composables/utils"

const resourceStore = useResourceStore()

const props = defineProps({
  content: { type: Object as PropType<LinkedResourceContent>, required: true },
})
const resource = computed<Resource>(() => {
  return resourceStore.resourcesById[props.content.linkedResource]
})

if (!resourceStore.resourcesById[props.content.linkedResource]) {
  await resourceStore.getResource(props.content.linkedResource, true)
}
</script>

<style lang="sass" scoped></style>
