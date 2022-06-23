<template>
  <ResourceMiniature v-model="basesPinnedIn" :resource="resource" />
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
const basesPinnedIn = computed<PinStatus[]>({
  get: () => resource.value?.basesPinnedIn || [],
  set(value: PinStatus[]) {
    resourceStore.refreshPinStatus(value, resource.value.id)
  },
})
</script>
