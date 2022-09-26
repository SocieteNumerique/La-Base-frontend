<template>
  <div id="resources">
    <div class="is-flex flex-space-between fr-mb-4w">
      <div class="fr-mt-3v">
        <span v-if="view === 'resources'"
          >{{ resourcesResult.count }}
          {{ pluralize(["fiche"], resourcesResult.count) }}</span
        >
        <span v-else>
          {{ base?.collections.length }}
          {{ pluralize(["collection"], base?.collections.length) }}
        </span>
      </div>
      <div v-if="view === 'resources'">
        <div style="text-align: center" class="fr-mb-4w">
          <button
            class="fr-btn fr-btn--tertiary-no-outline"
            style="font-weight: 400"
            :class="showLliveResources ? 'fr-btn--tertiary--active' : null"
            @click="showLliveResources = true"
          >
            Fiches publiées
          </button>
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-ml-1w"
            style="font-weight: 400"
            :class="!showLliveResources ? 'fr-btn--tertiary--active' : null"
            @click="showLliveResources = false"
          >
            Brouillons
          </button>
        </div>
      </div>
      <div v-if="base?.canWrite || base?.canAddResources">
        <DsfrButton
          v-show="view === 'resources'"
          icon="ri-add-line"
          label="Ajouter une fiche"
          @click="onAddResourceClick"
        />
        <DsfrButton
          v-show="view === 'collections' && !openCollectionId"
          icon="ri-add-line"
          label="Ajouter une collection"
          @click="onAddCollectionClick"
        />
        <DsfrButton
          v-show="view === 'collections' && openCollectionId"
          secondary
          label="Éditer la collection"
          icon="ri-edit-line"
          class="fr-mr-3w"
          @click="editCollectionModalTab = 'general'"
        />
        <DsfrButton
          v-show="view === 'collections' && openCollectionId"
          label="Gérer les fiches"
          icon="ri-file-line"
          @click="editCollectionModalTab = 'resources'"
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
          v-if="editCollectionModalTab !== ''"
          :collection="openCollection"
          :tab="editCollectionModalTab"
          @exit="editCollectionModalTab = ''"
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

    <template v-if="view === 'resources' && base?.canWrite">
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
            <VIcon scale="10" name="ri-loader-5-line" />
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
        <div v-else>Aucun résultat correspondant</div>
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
import { Base, Collection, Resource, SearchResult } from "~/composables/types"
import { useLoadingStore } from "~/stores/loadingStore"
import { pluralize } from "~/composables/strUtils"

const route = useRoute()
const router = useRouter()
const collectionStore = useCollectionStore()
const loadingStore = useLoadingStore()

const props = defineProps({
  base: { type: Object as PropType<Base>, required: true },
  resourcesResult: {
    type: Object as PropType<SearchResult<Resource>>,
    required: true,
  },
})

const showAddResourceModal = ref<boolean>(false)
const showAddCollectionModal = ref<boolean>(false)
const editCollectionModalTab = ref<"resources" | "general" | "">("")

const onAddResourceClick = () => {
  showAddResourceModal.value = true
}
const onAddCollectionClick = () => {
  showAddCollectionModal.value = true
}

const view = computed<string>({
  get: () => (route.query.view as string) || "resources",
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
</style>
