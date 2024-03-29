<template>
  <div id="resources">
    <div
      v-if="currentTab === 'collections'"
      class="is-flex flex-space-between fr-mb-4w"
    >
      <div style="display: flex; align-items: center">
        <div>
          <template v-if="openCollectionId">
            <h3 class="fr-h6 fr-mb-0">
              <NuxtLink
                :to="{ query: { tab: 'collections' } }"
                class="no-underline fr-text-title--blue-france"
              >
                <VIcon class="fr-mr-4w fr-my-auto" name="ri-arrow-left-line" />
              </NuxtLink>
              {{ openCollection.name }}
            </h3>
          </template>
          <template v-else>
            {{ base?.collections.length }} collections
          </template>
        </div>
      </div>
      <div v-if="base?.canWrite || base?.canAddResources">
        <IntroTooltip
          v-if="!openCollectionId"
          slug="CREATE_COLLECTION"
          style="display: inline-block"
        >
          <DsfrButton
            icon="ri-add-line"
            label="Ajouter une collection"
            class="fr-btn--sm"
            :secondary="true"
            @click="onAddCollectionClick"
          />
        </IntroTooltip>
        <IntroTooltip
          v-if="openCollectionId"
          slug="EDIT_COLLECTION"
          style="display: inline-block"
          class="fr-mr-3w"
        >
          <DsfrButton
            secondary
            label="Éditer la collection"
            icon="ri-edit-line"
            class="fr-btn--sm"
            @click="editCollectionModalTab = 'general'"
          />
        </IntroTooltip>
        <IntroTooltip
          v-if="openCollectionId"
          slug="EDIT_COLLECTION_RESOURCES"
          style="display: inline-block"
        >
          <DsfrButton
            label="Gérer les fiches"
            icon="ri-file-line"
            class="fr-btn--sm"
            @click="editCollectionModalTab = 'resources'"
          />
        </IntroTooltip>
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
        class="fr-mb-4w fr-container fr-p-0"
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
          <template v-if="!base?.paginatedResources.count">
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
      <div
        class="fr-mb-3w"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <SearchOrderBy class="fr-mt-n1w" />
        <div>
          {{ openCollectionSortedResource.length }}
          {{ pluralize(["fiche"], openCollectionSortedResource.length) }}
        </div>
      </div>

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
const showLiveResources = computed<boolean>({
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
