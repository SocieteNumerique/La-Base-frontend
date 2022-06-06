<template>
  <h5 v-if="!content.title">{{ resource?.title || content.linkedResource }}</h5>
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

<script lang="ts" setup>
import { LinkedResourceContent, Resource } from "~/composables/types"
import { PropType } from "vue"
import { useResourceStore } from "~/stores/resourceStore"

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
