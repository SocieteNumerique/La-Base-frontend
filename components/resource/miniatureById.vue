<template>
  <ResourceMiniature v-model="pinnedInBases" :resource="resource" />
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"
import { PinStatus, Resource } from "~/composables/types"

const resourceStore = useResourceStore()

const props = defineProps({
  resourceId: { type: Number, required: true },
})

const resource = computed<Resource>(
  () => resourceStore.resourcesById[props.resourceId]
)
const pinnedInBases = computed<number[]>({
  get: () => resource.value?.pinnedInBases || [],
  set(value: number[]) {
    resourceStore.refreshPinStatus(value, resource.value.id)
  },
})
</script>
