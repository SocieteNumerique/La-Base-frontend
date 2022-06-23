<template>
  <DsfrSelect
    v-model="selectedBase"
    :required="true"
    :label="props.label"
    :options="baseStore.baseOptions"
    :description="props.description"
  />
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { useModel } from "~/composables/modelWrapper"
import { onMounted } from "vue"

const props = defineProps({
  modelValue: { type: Number, default: () => undefined },
  label: { type: String, default: () => "Choisissez une base" },
  description: { type: String, default: () => "" },
})

const selectedBase = useModel<number>("modelValue")
const baseStore = useBaseStore()

onMounted(() => {
  selectedBase.value = (baseStore.baseOptions[0] || {}).id
})
</script>
