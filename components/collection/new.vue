<template>
  <CollectionEdit :collection="collection" :is-new="true" @exit="onExit" />
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { CollectionCreate } from "~/composables/types"

const baseStore = useBaseStore()
const emits = defineEmits(["close"])

const newCollectionInit = {
  base: baseStore.currentId!,
  description: "",
  name: "",
}
const collection = ref<CollectionCreate>(newCollectionInit)

function onExit() {
  collection.value = newCollectionInit
  emits("close")
}
</script>
