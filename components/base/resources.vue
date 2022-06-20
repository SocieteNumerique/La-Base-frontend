<template>
  <div>
    <div class="is-flex flex-space-between fr-mb-4w">
      <div class="fr-btns-group--xs">
        <button
          :class="{ '-active': view === 'resources' }"
          class="btn-tab-activable fr-btn--tertiary-no-outline fr-p-2v fr-mr-5w"
          @click="view = 'resources'"
        >
          <VIcon name="ri-file-line" />
          Voir les fiches
        </button>
        <button
          :class="{ '-active': view === 'collections' }"
          class="btn-tab-activable fr-btn--tertiary-no-outline fr-p-2v"
          @click="view = 'collections'"
        >
          <VIcon name="ri-folder-3-line" />
          Voir les collections
        </button>
      </div>
      <div v-if="base?.canWrite || base?.canAddResources">
        <DsfrButton
          v-show="view === 'resources'"
          :secondary="true"
          label="Ajouter une ressource"
          @click="onAddResourceClick"
        />
        <DsfrButton
          v-show="view === 'collections'"
          :secondary="true"
          label="Ajouter une collection"
          @click="onAddCollectionClick"
        />
        <ResourceCreationModal
          v-if="showAddResourceModal"
          @close="showAddResourceModal = false"
        />
        <CollectionNew
          v-if="showAddCollectionModal"
          @close="showAddCollectionModal = false"
        />
      </div>
    </div>

    <template v-if="view === 'collections' && openCollectionId === undefined">
      <div class="resource-grid">
        <div v-for="collectionId of base?.collections" :key="collectionId">
          <CollectionMiniatureById
            :collection-id="collectionId"
            :editable="true"
          />
        </div>
      </div>
      <div v-if="!base.collections.length">
        Vous n’avez pas encore créé de collection de fiches ressources
      </div>
    </template>

    <template v-if="view === 'resources'">
      <div class="resource-grid">
        <div v-for="resourceId of base?.resources" :key="resourceId">
          <ResourceMiniatureById :resource-id="resourceId" />
        </div>
      </div>
    </template>

    <template v-if="view === 'collections' && openCollection">
      <h3 class="fr-h6 fr-mb-5w">
        <NuxtLink
          :to="{ query: { view: 'collections' } }"
          class="no-underline fr-text-title--blue-france"
        >
          <VIcon class="fr-mr-4w fr-my-auto" name="ri-arrow-left-line" />
        </NuxtLink>
        {{ openCollection.name }}
      </h3>

      <div class="resource-grid">
        <div
          v-for="resourceId of openCollection?.resources || []"
          :key="resourceId"
        >
          <ResourceMiniatureById :resource-id="resourceId" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router"
import { computed, PropType } from "vue"
import { useCollectionStore } from "~/stores/collectionStore"
import { Base, Collection } from "~/composables/types"

const route = useRoute()
const router = useRouter()
const collectionStore = useCollectionStore()

defineProps({
  base: { type: Object as PropType<Base>, required: true },
})

const showAddResourceModal = ref<boolean>(false)
const showAddCollectionModal = ref<boolean>(false)
const onAddResourceClick = () => {
  showAddResourceModal.value = true
}
const onAddCollectionClick = () => {
  showAddCollectionModal.value = true
}

const view = computed<string>({
  get: () => (route.query.view as string) || "resources",
  set: (value) => router.push({ query: { view: value } }),
})
const openCollectionId = computed<number | undefined>(
  () => route.query.collection as unknown as number
)
const openCollection = computed<Collection | undefined>(() => {
  if (openCollectionId.value !== undefined)
    return collectionStore.collectionsById[openCollectionId.value]
  return undefined
})
</script>

<style lang="sass" scoped></style>
