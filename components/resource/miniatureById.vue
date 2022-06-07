<template>
  <ResourceMiniature :resource="resource" />
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"
import { Resource } from "~/composables/types"

const resourceStore = useResourceStore()

const props = defineProps({
  resourceId: { type: Number, required: true },
})

const resource = computed<Resource>(
  () => resourceStore.resourcesById[props.resourceId]
)
</script>
