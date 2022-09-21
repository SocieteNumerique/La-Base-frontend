<template>
  <div id="resources">
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
          label="Ajouter une ressource"
          @click="onAddResourceClick"
        />
        <DsfrButton
          v-show="view === 'collections' && !openCollectionId"
          label="Ajouter une collection"
          @click="onAddCollectionClick"
        />
        <DsfrButton
          v-show="view === 'collections' && openCollectionId"
          label="Éditer une collection"
          secondary
          @click="showEditCollectionModal = true"
        />
        <ResourceCreationModal
          v-if="showAddResourceModal"
          :base-id="base.id"
          @close="showAddResourceModal = false"
        />
        <CollectionNew
          v-if="showAddCollectionModal"
          @close="showAddCollectionModal = false"
        />
        <CollectionEdit
          v-if="showEditCollectionModal"
          :collection="openCollection"
          @exit="showEditCollectionModal = false"
        />
      </div>
    </div>

    <template v-if="view === 'collections' && openCollectionId === undefined">
      <div class="resource-grid">
        <CollectionMiniatureById
          v-for="collectionId of base?.collections"
          :key="collectionId"
          :collection-id="collectionId"
          :editable="true"
        />
      </div>
      <div v-if="!base?.collections?.length">
        Vous n’avez pas encore créé de collection de fiches ressources
      </div>
    </template>

    <template v-if="view === 'resources'">
      <!-- loading spinner -->
      <template
        v-if="
          loadingStore.isLoading('bases') ||
          loadingStore.isLoading('basesResources')
        "
      >
        <div class="fr-p-5w" style="text-align: center">
          <div style="animation: spin 1.5s linear infinite">
            <VIcon scale="10" name="ri-loader-5-line" />
          </div>
        </div>
      </template>

      <!-- results -->
      <template v-else>
        <div class="resource-grid">
          <ResourceMiniatureById
            v-for="resourceId of base?.resourcesInPage"
            :key="resourceId"
            :resource-id="resourceId"
          />
        </div>
      </template>

      <!-- pagination -->
      <div v-if="baseStore.pageCount > 1" class="is-flex flex-center">
        <DsfrPagination
          v-model:current-page="baseStore.currentPage"
          :pages="pages"
          @update:current-page="onCurrentPageChange"
        />
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
        <ResourceMiniatureById
          v-for="resourceId of openCollection?.resources || []"
          :key="resourceId"
          :resource-id="resourceId"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router"
import { computed, PropType } from "vue"
import { useCollectionStore } from "~/stores/collectionStore"
import { Base, Collection } from "~/composables/types"
import { useBaseStore } from "~/stores/baseStore"
import { useLoadingStore } from "~/stores/loadingStore"

const route = useRoute()
const router = useRouter()
const baseStore = useBaseStore()
const collectionStore = useCollectionStore()
const loadingStore = useLoadingStore()

defineProps({
  base: { type: Object as PropType<Base>, required: true },
})

const showAddResourceModal = ref<boolean>(false)
const showAddCollectionModal = ref<boolean>(false)
const showEditCollectionModal = ref<boolean>(false)

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

const pages = computed(() => {
  if (baseStore.pageCount <= 1) {
    return []
  }
  let nPages = baseStore.pageCount
  nPages = Math.min(nPages, 10) // maximum 10 pages
  const toReturn = [...Array(nPages).keys()]
    .map((number) => number + 1)
    .map((page) => ({
      label: String(page),
      title: `Page ${page}`,
      href: `?page=${page}`,
    }))
  return toReturn
})

const onCurrentPageChange = async (pageZeroBased: number) => {
  await baseStore.updateResourcesInPage(pageZeroBased + 1)
  baseStore.currentPage = pageZeroBased
  document.getElementById("resources")!.scrollIntoView({ behavior: "smooth" })
}
</script>

<style lang="sass" scoped></style>
