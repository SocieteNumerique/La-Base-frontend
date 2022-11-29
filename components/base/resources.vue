<template>
  <div id="resources">
    <div class="is-flex flex-space-between fr-mb-4w">
      <div style="display: flex; align-items: center">
        <div v-if="currentTab === 'collections'">
          {{ base?.collections.length }} collections
        </div>
      </div>
      <div v-if="base?.canWrite && currentTab === 'resources'">
        <div style="text-align: center; display: flex" class="fr-mb-3w">
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-px-1v"
            style="font-weight: 400"
            :class="
              showLliveResources
                ? 'fr-btn--tertiary--active'
                : 'fr-text--disabled'
            "
            @click="showLliveResources = true"
          >
            Fiches publiées
          </button>
          <div class="vertical-separator"></div>
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-px-1v"
            style="font-weight: 400"
            :class="
              !showLliveResources
                ? 'fr-btn--tertiary--active'
                : 'fr-text--disabled'
            "
            @click="showLliveResources = false"
          >
            Brouillons
          </button>
        </div>
      </div>
      <div v-if="base?.canWrite || base?.canAddResources">
        <DsfrButton
          v-show="currentTab === 'collections' && !openCollectionId"
          icon="ri-add-line"
          label="Ajouter une collection"
          class="fr-btn--sm"
          :secondary="true"
          @click="onAddCollectionClick"
        />
        <DsfrButton
          v-show="currentTab === 'collections' && openCollectionId"
          secondary
          label="Éditer la collection"
          icon="ri-edit-line"
          class="fr-mr-3w fr-btn--sm"
          @click="editCollectionModalTab = 'general'"
        />
        <DsfrButton
          v-show="currentTab === 'collections' && openCollectionId"
          label="Gérer les fiches"
          icon="ri-file-line"
          class="fr-btn--sm"
          @click="editCollectionModalTab = 'resources'"
        />
        <CollectionNew
          v-if="showAddCollectionModal"
          @close="showAddCollectionModal = false"
        />
        <CollectionEdit
          v-if="editCollectionModalTab !== ''"
          :collection="openCollection"
          :tab="editCollectionModalTab"
          @exit="editCollectionModalTab = ''"
        />
      </div>
    </div>

    <template
      v-if="currentTab === 'collections' && openCollectionId === undefined"
    >
      <div class="resource-grid">
        <CollectionMiniatureById
          v-for="collectionId of base?.collections"
          :key="collectionId"
          :collection-id="collectionId"
          :editable="true"
        />
      </div>
      <div v-if="!base?.collections?.length">
        Aucune collection n'a encore été ajoutée.
      </div>
    </template>

    <template v-if="currentTab === 'resources'">
      <div
        style="
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        "
        class="fr-mb-4w fr-mt-3w fr-container fr-p-0"
      >
        <SearchOrderBy />
        <div>
          {{ resourcesResult.count }}
          {{ pluralize(["résultat"], resourcesResult.count, true) }}
        </div>
      </div>
      <!-- loading spinner -->
      <template
        v-if="
          loadingStore.isLoading('bases') ||
          loadingStore.isLoading('basesResources') ||
          loadingStore.isLoading('search')
        "
      >
        <div class="fr-p-5w" style="text-align: center">
          <div style="animation: spin 1.5s linear infinite">
            <VIcon scale="3" name="ri-loader-2-line" />
          </div>
        </div>
      </template>

      <!-- results -->
      <template v-else>
        <div v-if="resourcesResult.count" class="resource-grid">
          <!-- eslint-disable vue/no-mutating-props -->
          <ResourceMiniature
            v-for="(resource, index) of resourcesResult.results.objects"
            :key="resource?.id"
            v-model="resourcesResult.results.objects[index].pinnedInBases"
            :resource="resource"
          />
        </div>
        <div v-else>
          <template v-if="!base?.resources.count">
            Aucune fiche n'a encore été ajoutée.
          </template>
          <template v-else>Aucun résultat correspondant.</template>
        </div>
      </template>

      <!-- pagination -->
      <div v-if="pages.length" class="is-flex flex-center">
        <DsfrPagination
          v-model:current-page="currentPage"
          :pages="pages"
          @update:current-page="onCurrentPageChange"
        />
      </div>
    </template>

    <template v-if="currentTab === 'collections' && openCollection">
      <h3 class="fr-h6 fr-mb-5w">
        <NuxtLink
          :to="{ query: { tab: 'collections' } }"
          class="no-underline fr-text-title--blue-france"
        >
          <VIcon class="fr-mr-4w fr-my-auto" name="ri-arrow-left-line" />
        </NuxtLink>
        {{ openCollection.name }}
      </h3>

      <SearchOrderBy class="fr-mb-3w" />

      <div class="resource-grid">
        <ResourceMiniatureById
          v-for="resourceId of openCollectionSortedResource"
          :key="resourceId"
          :resource-id="resourceId"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router"
import { computed, PropType, watch } from "vue"
import { useCollectionStore } from "~/stores/collectionStore"
import { Collection, Resource, SearchResult } from "~/composables/types"
import { useLoadingStore } from "~/stores/loadingStore"
import { pluralize } from "~/composables/strUtils"
import { useBaseStore } from "~/stores/baseStore"
import { useResourceStore } from "~/stores/resourceStore"

const route = useRoute()
const router = useRouter()
const collectionStore = useCollectionStore()
const loadingStore = useLoadingStore()
const baseStore = useBaseStore()
const resourceStore = useResourceStore()

const props = defineProps({
  resourcesResult: {
    type: Object as PropType<SearchResult<Resource>>,
    required: true,
  },
})

const base = computed(() => {
  return baseStore.current
})

const showAddCollectionModal = ref<boolean>(false)
const editCollectionModalTab = ref<"resources" | "general" | "">("")

const onAddCollectionClick = () => {
  showAddCollectionModal.value = true
}
const resourceOrderByGetter: {
  [key: string]: (resource: Resource) => number
} = {
  visit_count: (resource: Resource) => {
    return resource.stats?.visitCount || 0
  },
  modified: (resource: Resource) => {
    return Date.parse(resource.modified)
  },
}
const getSortedCollectionResources = (): number[] => {
  if (currentTab.value !== "collections" || !openCollection.value?.resources) {
    return []
  }

  const resources = [...openCollection.value.resources]
  const orderBy = (route.query.orderBy as string) || "-modified"
  const orderByWithoutSign = orderBy.replace(/^\-/, "")
  const asc = orderBy === orderByWithoutSign

  const values = resources.sort((resourceIdA, resourceIdB) => {
    const resourceA: Resource = resourceStore.resourcesById[resourceIdA]
    const resourceB: Resource = resourceStore.resourcesById[resourceIdB]

    if (!(orderByWithoutSign in resourceOrderByGetter)) {
      return 0
    }
    const a = resourceOrderByGetter[orderByWithoutSign](resourceA)
    const b = resourceOrderByGetter[orderByWithoutSign](resourceB)
    return asc ? a - b : b - a
  })
  return values
}

const currentTab = computed<string>({
  get: () => (route.query.tab as string) || "resources",
  set: (value) => router.push({ query: { ...route.query, view: value } }),
})
const showLliveResources = computed<boolean>({
  get: () => Boolean(Number(((<string>route.query.live) as string) || "1")),
  set: (value) =>
    router.push({ query: { ...route.query, live: String(Number(value)) } }),
})
const openCollectionId = computed<number | undefined>(
  () => route.query.collection as unknown as number
)
const openCollection = computed<Collection | undefined>(() => {
  if (openCollectionId.value !== undefined)
    return collectionStore.collectionsById[openCollectionId.value]
  return undefined
})
const openCollectionSortedResource = ref<number[]>(
  getSortedCollectionResources()
)

watch(
  () => route.query,
  () => {
    openCollectionSortedResource.value = getSortedCollectionResources()
  }
)

// pagination
const pages = computed(() => {
  return paginationFromNResults(props.resourcesResult.count)
})

const currentPage = computed<number>({
  get: () => Number(route.query.page) || 0,
  set(page: number) {
    router.replace({ query: { ...route.query, page: page } })
  },
})

const onCurrentPageChange = async (pageZeroBased: number) => {
  currentPage.value = pageZeroBased
}
</script>

<style lang="sass" scoped>
.fr-btn--tertiary--active
  border-bottom-width: 1px !important
  font-weight: 400

.fr-text--disabled
  color: var(--text-disabled-grey) !important

.vertical-separator
  width: 1px
  border-right: 1px solid var(--border-default-grey)
  margin: 0 24px
</style>
