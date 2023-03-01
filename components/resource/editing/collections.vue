<template>
  <div>
    <p v-if="!base?.collections?.length">
      Vous n’avez pas encore créé de collections dans cette base.
    </p>
    <div v-else>
      <DsfrCheckboxSet
        v-model="collections"
        legend="Ajouter la fiche aux collections :"
        :options="options"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { useBaseStore } from "~/stores/baseStore"
import { computed, watch } from "vue"
import { Base } from "~/composables/types"
import { useCollectionStore } from "~/stores/collectionStore"

const resourceStore = useResourceStore()
const baseStore = useBaseStore()
const collectionsStore = useCollectionStore()

const base = computed<Base | null>(() => {
  if (
    resourceStore.current == null ||
    baseStore.basesById[resourceStore.current.rootBase] == null
  ) {
    return null
  }

  return baseStore.basesById[resourceStore.current.rootBase]
})

if (resourceStore.current && (!base.value || base.value?.isShort)) {
  await baseStore.getBase(resourceStore.current.rootBase!)
}

let initialCollections: number[] = []
if (base.value) {
  initialCollections =
    base
      .value!.collections?.map(
        (collectionId) => collectionsStore.collectionsById[collectionId]
      )
      .filter(
        (collection) =>
          collection.resources!.indexOf(resourceStore.currentId!) !== -1
      )
      .map((collection) => collection.id) || []
}

const collections = ref<string[]>(initialCollections.map(String))
const options = computed(() => {
  if (!base.value) {
    return []
  }
  return base.value
    .collections!.map(
      (collectionId) => collectionsStore.collectionsById[collectionId]
    )
    .map((collection) => ({
      label: collection.name,
      id: String(collection.id),
      name: String(collection.id),
    }))
})

// update resourceStore collections when collections change here
watch(
  () => collections.value,
  () => {
    if (!resourceStore.currentId) {
      return
    }
    resourceStore.resourcesById[resourceStore.currentId!].collections =
      Object.values(collections.value).map(Number)
  }
)
</script>
