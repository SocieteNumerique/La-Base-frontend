<template>
  <h5 v-if="!content.title">{{ resource?.title || content.linkedResource }}</h5>
  <VIcon name="link-line" />
  <NuxtLink :to="`resource/${content.linkedResource}`">Ouvrir</NuxtLink>
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
  // TODO only short version
  await resourceStore.getResource(props.content.linkedResource)
}
</script>

<style lang="sass" scoped></style>
