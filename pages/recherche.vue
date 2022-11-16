<template>
  <div>
    <Search @results="updateResults" />

    <!-- is loading -->
    <template v-if="loadingStore.isLoading('search')">
      <div class="fr-p-5w" style="text-align: center">
        <div style="animation: spin 1.5s linear infinite">
          <VIcon scale="3" name="ri-loader-2-line" />
        </div>
      </div>
    </template>

    <!-- results -->
    <template v-else>
      <div
        id="search-results"
        style="
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        "
        class="fr-my-4w fr-container"
      >
        <SearchOrderBy />
        <div>
          <template v-if="nResults">
            {{ nResults }}
            {{ pluralize(["résultat"], nResults, true) }}
          </template>
          <template v-else> aucun résultat correspondant </template>
          <span v-if="searchedText"> pour {{ searchedText }}</span>
        </div>
      </div>

      <div class="fr-mb-4w fr-container">
        <div v-if="dataTypeFromSearchResponse === 'bases'" class="bases-holder">
          <BaseMiniature v-for="base of results" :key="base.id" :base="base" />
        </div>
        <div
          v-if="dataTypeFromSearchResponse === 'resources'"
          class="resource-grid"
        >
          <ResourceMiniature
            v-for="(resource, index) of results"
            :key="resource?.id"
            v-model="results[index].pinnedInBases"
            :resource="resource"
          />
        </div>
      </div>
    </template>
    <!-- pagination -->
    <div v-if="nResults && nResults > pageSize" class="is-flex flex-center">
      <DsfrPagination
        v-model:current-page="currentPage"
        :pages="pages"
        @update:current-page="onCurrentPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFullWidth } from "~/composables/useFullWidth"
import { useLoadingStore } from "~/stores/loadingStore"
import { computed } from "vue"
import { Base, GenericSearchResult, Resource } from "~/composables/types"
import { paginationFromNResults } from "~/composables/pagination"
import { useRoute, useRouter } from "vue-router"
import { useMainStore } from "~/stores/mainStore"

const loadingStore = useLoadingStore()
const router = useRouter()
const route = useRoute()

const results = ref<Base[] | Resource[]>([])
const searchedText = ref("")
const pageSize = 12

useFullWidth()

const dataType = computed<string>({
  get: () => <string>route.query.dataType || "resources",
  set(newDataType: string) {
    router.replace({ query: { ...route.query, dataType: newDataType } })
  },
})

const dataTypeFromSearchResponse = ref(dataType.value)

const updateDataType = (newDataType: "resources" | "bases") => {
  router.replace({ query: { ...route.query, dataType: newDataType } })
}
const nResults = ref(0)
const currentPage = computed<number>({
  get: () => Number(route.query.page) || 0,
  set(page: number) {
    router.replace({ query: { ...route.query, page: page } })
  },
})

const updateResults = (newResults: GenericSearchResult) => {
  dataTypeFromSearchResponse.value = newResults.results.dataType
  results.value = newResults.results.objects
  nResults.value = newResults.count
}
// pagination
const pages = computed(() => {
  return paginationFromNResults(nResults.value)
})
const onCurrentPageChange = (page: number) => {
  currentPage.value = page
}
</script>
