<template>
  <div id="search-container">
    <div
      :style="
        showFilters ? null : 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)'
      "
    >
      <div
        class="fr-pt-5v fr-pb-4v"
        style="background: var(--background-alt-blue-france)"
      >
        <div class="fr-container">
          <div class="fr-grid-row">
            <div v-if="!isInBaseIndex" class="fr-col-md-4 fr-p-0">
              <div class="is-flex" style="align-items: center">
                <IntroTooltip slug="INDEX_SEARCH_SWITCH">
                  <div class="toggle-container">
                    <button
                      class="toggle-button"
                      :class="dataType === 'resources' ? '-active' : null"
                      @click="setDataType('resources')"
                    >
                      <img
                        alt="Chercher des ressources"
                        class="fr-mr-3v"
                        src="/img/home/resource-blue.svg"
                        style="height: 18px"
                      />
                      <span>Fiches</span>
                    </button>
                    <button
                      class="toggle-button"
                      :class="dataType === 'bases' ? '-active' : null"
                      @click="setDataType('bases')"
                    >
                      <img
                        alt="Chercher des bases"
                        class="fr-mr-3v"
                        src="/img/home/base-blue.svg"
                      />
                      <span>Bases</span>
                    </button>
                  </div>
                </IntroTooltip>
              </div>
            </div>
            <div v-if="canShowDrafts" class="fr-col-md-4 fr-p-0">
              <div class="is-flex" style="align-items: center">
                <IntroTooltip slug="FICHES_SWITCH">
                  <div class="toggle-container">
                    <button
                      title="Afficher les ressources publiées"
                      class="toggle-button"
                      :class="showLiveResources ? '-active' : null"
                      @click="showLiveResources = true"
                    >
                      <img
                        class="fr-mr-3v"
                        src="/img/home/resource-blue.svg"
                        alt=""
                        style="height: 18px"
                      />
                      <span>Fiches</span>
                    </button>
                    <button
                      title="Afficher les brouillons"
                      class="toggle-button"
                      :class="!showLiveResources ? '-active' : null"
                      @click="showLiveResources = false"
                    >
                      <img class="fr-mr-3v" src="/img/home/drafts.svg" alt="" />
                      <span>Brouillons</span>
                    </button>
                  </div>
                </IntroTooltip>
              </div>
            </div>
            <div
              class="fr-col-md-8 fr-p-0 is-flex"
              :style="isInBaseIndex ? null : 'justify-content: space-between'"
            >
              <div>
                <IntroTooltip slug="INDEX_SEARCH_BAR">
                  <div class="fr-search-bar fr-input-group">
                    <input
                      id="search"
                      v-model="textInput"
                      class="fr-input"
                      type="text"
                      :placeholder="
                        isInBaseIndex
                          ? 'Rechercher dans cette base'
                          : 'Rechercher dans toute la plateforme'
                      "
                      style="width: 308px"
                      @input="onTextInput"
                    />
                    <button class="fr-btn">
                      <VIcon name="ri-search-line" />
                    </button>
                  </div>
                </IntroTooltip>
              </div>
              <div
                :style="isInBaseIndex ? 'margin-left: 24px' : null"
                style="display: flex"
              >
                <IntroTooltip slug="INDEX_FILTERS">
                  <button class="fr-btn" @click="toggleFilters">
                    Filtrer
                    <span style="padding-left: 3px">
                      <VIcon v-if="!showFilters" name="ri-arrow-down-s-line" />
                      <VIcon v-if="showFilters" name="ri-arrow-up-s-line" />
                    </span>
                  </button>
                </IntroTooltip>
                <div
                  v-if="!isInBaseIndex && userStore.isLoggedIn"
                  class="fr-ml-2w"
                >
                  <IntroTooltip slug="SAVE_SEARCH">
                    <button
                      v-if="!isInBaseIndex"
                      class="fr-btn fr-btn--secondary"
                      @click="toggleUserSearch"
                    >
                      Mes recherches
                      <span style="padding-left: 3px">
                        <VIcon
                          v-if="!showUserSearches"
                          name="ri-arrow-down-s-line"
                        />
                        <VIcon
                          v-if="showUserSearches"
                          name="ri-arrow-up-s-line"
                        />
                      </span>
                    </button>
                  </IntroTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedTags.length"
        class="fr-container fr-pt-2w fr-pb-1v"
        style="background: white"
      >
        <ul class="fr-tags-group">
          <li v-for="tagId in selectedTags" :key="tagId">
            <button
              class="fr-tag--dismiss fr-tag"
              :aria-label="`Retirer ${tagStore.tagsById[tagId].name}`"
              @click="removeTag(tagId)"
            >
              {{ tagStore.tagsById[tagId].name }}
            </button>
          </li>
          <li>
            <DsfrButton
              label="Réinitialiser"
              icon="ri-close-circle-line"
              class="fr-btn--tertiary-no-outline reset-btn"
              @click="resetTags"
            />
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="showFilters || showUserSearches"
      class="fr-pt-1w fr-pb-4w"
      style="box-shadow: rgb(0 0 0 / 25%) 0px 4px 4px; background: white"
    >
      <div class="fr-container">
        <template v-if="showFilters">
          <div class="fr-mt-1w small-radio-buttons">
            <DsfrRadioButtonSet
              v-model="tagOperatorInput"
              name="tagOperator"
              :inline="true"
              :options="[
                { label: 'Tous les tags sélectionnés', value: 'AND' },
                { label: 'Au moins un des tags sélectionnés ', value: 'OR' },
              ]"
              legend="Les résultats comportent :"
              class="inline-radio fr-mb-3w"
              @update:model-value="onRadioChange"
            />
          </div>
          <div class="dropdown-holder">
            <TagDropdown
              v-for="category of tagCategories"
              :key="category.id"
              :category="category"
              :is-focused="focusedCategory === category.id"
              :selected-tags="selectedTags"
              :enabled-tags="tagOperatorInput === 'AND' ? possibleTags : null"
              :count-origin="dataType === 'resources' ? 'resource' : 'base'"
              @focus="focusedCategory = category.id"
              @blur="focusedCategory = 0"
              @select="onSelect"
            />
            <TagLicenseDropdown
              v-if="dataType === 'resources'"
              :is-focused="focusedCategory === licenseTypeCategoryId"
              :selected-tags="selectedTags"
              :enabled-tags="tagOperatorInput === 'AND' ? possibleTags : null"
              :tag-operator="tagOperatorInput"
              @focus="focusedCategory = licenseTypeCategoryId"
              @blur="focusedCategory = 0"
              @select="onSelect"
            />
          </div>
          <div v-if="isInBaseIndex" class="fr-mt-1w small-radio-buttons">
            <DsfrRadioButtonSet
              v-model="resourceBaseFilterInput"
              name="resourceBaseFilter"
              :inline="true"
              :options="[
                { label: 'Toutes les fiches', value: '' },
                {
                  label: 'Les fiches créées par la base',
                  value: 'create',
                },
                {
                  label: 'Les fiches enregistrées par la base',
                  value: 'save',
                },
              ]"
              legend="Afficher :"
              class="inline-radio fr-mb-0"
              @update:model-value="onRadioFileBaseFilter"
            />
          </div>
          <div
            class="fr-mt-1w"
            style="display: flex; justify-content: space-between"
          >
            <div class="fr-mt-3v">
              {{ nResults }} {{ pluralize(["résultat"], nResults) }}
            </div>
            <div
              v-if="userStore.isLoggedIn && !isInBaseIndex"
              style="display: flex; align-items: flex-end"
            >
              <DsfrButton
                label="Enregistrer la recherche"
                icon="ri-save-line"
                secondary
                class="fr-btn--sm"
                :disabled="isSaveSearchDisabled"
                @click="showUserSearchAddModal = true"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="fr-pt-2v"
            style="display: flex; justify-content: space-between"
          >
            <div v-if="!searches.length" class="fr-text--sm fr-mb-0 fr-pt-2v">
              Vous n’avez pas encore de recherche enregistrée pour les
              {{ dataType === "resources" ? "Fiches" : "Bases" }}
            </div>
            <div v-else style="margin-left: -12px; margin-top: -16px">
              <UserSearchTag
                v-for="search of userSearchStore.searchesForDataType(dataType)"
                :id="search.id"
                :key="search.id"
                :active="activeUserSearch === search.id"
                @select="selectUserSearch(search)"
              />
            </div>
            <div style="padding-top: 3px; flex-shrink: 0">
              <div>
                <DsfrButton
                  label="Enregistrer la recherche"
                  icon="ri-save-line"
                  secondary
                  class="fr-btn--sm"
                  :disabled="isSaveSearchDisabled"
                  @click="showUserSearchAddModal = true"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <UserSearchAddModal
      v-if="showUserSearchAddModal"
      :query="searchQuery"
      @close="showUserSearchAddModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useApiPost } from "~/composables/api"
import {
  BasesSearchResult,
  ResourcesSearchResult,
  TagCategory,
  UserSearch,
} from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { DsfrRadioButtonSet } from "@gouvminint/vue-dsfr"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { pluralize } from "~/composables/strUtils"
import { onFocusOut } from "~/composables/focusOut"
import { useUserSearchStore } from "~/stores/userSearchStore"
import { useUserStore } from "~/stores/userStore"
import { useBaseStore } from "~/stores/baseStore"

definePageMeta({
  layout: false,
  title: "Base",
})

const tagOperatorInput = ref<"OR" | "AND">("AND")
const resourceBaseFilterInput = ref<"" | "create" | "save">("")
const focusedCategory = ref(0)

const tagStore = useTagStore()
const userSearchStore = useUserSearchStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const baseStore = useBaseStore()

const activeUserSearch = ref(-1)
const nResults = ref(0)
const textInput = ref<string>(<string>route.query.text || "")
const possibleTags = ref<number[]>([])
const showUserSearchAddModal = ref(false)

// hide filters on outside click
onFocusOut(
  () => (showFilters.value = false),
  "search-container",
  () => showFilters.value
)
onFocusOut(
  () => (showUserSearches.value = false),
  "search-container",
  () => showUserSearches.value
)

const emit = defineEmits(["results", "searchedText"])

const resetActiveUserTag = () => (activeUserSearch.value = -1)

const setDataType = (type: "bases" | "resources") => {
  // when changing from resources to bases, pin_count is no longer possible
  // so we also update orderBy at the same time
  if (type === "bases" && orderBy.value.includes("pin_count")) {
    router.push({
      query: { ...route.query, dataType: type, orderBy: "-modified" },
    })
  } else {
    dataType.value = type
  }
  resetActiveUserTag()
}

const dataType = computed<"resources" | "bases">({
  get: () => <"resources" | "bases">route.query.dataType || "resources",
  set: (type: string) => {
    router.push({ query: { ...route.query, dataType: type } })
    resetActiveUserTag()
  },
})
const showLiveResources = computed<boolean>({
  get: () => Boolean(Number(((<string>route.query.live) as string) || "1")),
  set: (value) =>
    router.push({ query: { ...route.query, live: String(Number(value)) } }),
})
const searches = computed(() => {
  return userSearchStore.searchesForDataType(dataType.value)
})

const currentPage = computed<number>({
  get: () => Number(route.query.page) || 0,
  set(page: number) {
    updateRouterQuery({ page })
    resetActiveUserTag()
  },
})
const tagOperator = computed<string>({
  get: () => <string>route.query.tagOperator || "AND",
  set(newTagOperator: string) {
    updateRouterQuery({ tagOperator: newTagOperator, page: 0 })
    resetActiveUserTag()
  },
})
const resourceBaseFilter = computed<string>({
  get: () => <string>route.query.resourceBaseFilter || "",
  set(newValue: string) {
    updateRouterQuery({ resourceBaseFilter: newValue, page: 0 })
  },
})
const orderBy = computed<string>({
  get: () => <string>route.query.orderBy || "-modified",
  set(newValue: string) {
    updateRouterQuery({ orderBy: newValue, page: 0 })
    resetActiveUserTag()
  },
})
const isLiveResources = computed<boolean>(() =>
  Boolean(Number(((<string>route.query.live) as string) || "1"))
)
const selectedTags = computed<number[]>({
  get: () => {
    return (<string>route.query.tags || "")
      .split(",")
      .filter((el) => el.length)
      .map(Number)
  },
  set(tags: number[]) {
    updateRouterQuery({ tags: tags.join(","), page: 0 })
    resetActiveUserTag()
  },
})

const updateRouterQuery = (newQueryParams: any) => {
  router.replace({ query: { ...route.query, ...newQueryParams } })
}

const searchQuery = computed(() => {
  return {
    orderBy: orderBy.value,
    tagOperator: tagOperator.value,
    tags: selectedTags.value,
    text: textInput.value,
  }
})

watch(
  () => route.query,
  (query, oldQuery) => {
    const oldDataype = oldQuery.dataType || "resources"
    const newDataype = query.dataType || "resources"
    if (oldDataype != newDataype) {
      reset()
    }
    if (query.page != oldQuery.page) {
      doSearch(true)
    }
    if (query.update != oldQuery.update) {
      // query.update is a kinda hacky way to make sure refresh is updated
      // on login/logout
      doSearch(false)
    }
    if (query.orderBy != oldQuery.orderBy) {
      doSearch(false)
    }
    if (query.text != oldQuery.text) {
      textInput.value = <string>query.text
      doSearch(false)
    }
  }
)

watch(
  () => textInput.value,
  () => {
    updateRouterQuery({ text: textInput.value })
  }
)
watch(
  () => isLiveResources.value,
  () => {
    doSearch()
  }
)

const tagCategories = computed<TagCategory[]>(() => {
  const filterKey = dataType.value === "resources" ? "Resource" : "Base"
  return tagStore.categories.filter(
    (category) =>
      category.relatesTo?.includes(filterKey) &&
      !hiddenCategorySlugs.includes(category.slug)
  )
})

const isInBaseIndex = computed(() => route.path.startsWith("/base"))
const canShowDrafts = computed(() => {
  if (!isInBaseIndex.value) {
    return false
  }
  return baseStore.current.canWrite
})
const showFilters = ref(false)
const showUserSearches = ref(false)

const toggleFilters = () => {
  showUserSearches.value = false
  showFilters.value = !showFilters.value
}
const toggleUserSearch = () => {
  showFilters.value = false
  showUserSearches.value = !showUserSearches.value
}

const onTextInput = () => {
  doSearch(false, 400)
  resetActiveUserTag()
}

const selectUserSearch = (search: UserSearch) => {
  if (activeUserSearch.value == search.id) {
    // search was already active, we de-activate it
    reset()
    return
  }
  // we use a timeout because otherwise the route watchers would
  // overwrite activeSearchValue to -1
  setTimeout(() => (activeUserSearch.value = search.id), 200)
  router.replace({
    query: {
      dataType: dataType.value,
      orderBy: search.query.orderBy,
      tagOperator: search.query.tagOperator,
      text: search.query.text,
      tags: search.query.tags.join(","),
    },
  })
  tagOperatorInput.value = search.query.tagOperator
  doSearch()
}

const licenseTypeCategoryId = tagStore.tagCategoryIdsBySlug["license_01license"]
const hiddenCategorySlugs = ["license_02free", "license_01license"]

let searchTimeout: ReturnType<typeof setTimeout>
let latestSearchLaunched: number = Date.now()
const doSearch = (scrollToTop = false, debounceDelay = 0) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  const searchParams = {
    text: textInput.value,
    dataType: dataType.value,
    tags: selectedTags.value,
    tagOperator: tagOperator.value,
    restrictToBase: (isInBaseIndex.value && route.params.id) || null,
    live: isLiveResources.value,
    orderBy: orderBy.value,
    resourceBaseFilter: resourceBaseFilter.value,
  }
  searchTimeout = setTimeout(async () => {
    const launchedAt = Date.now()
    latestSearchLaunched = launchedAt

    // see comment on useApiPost parameters on why constructing custom key is necessary
    const customKey = [
      textInput.value,
      dataType.value,
      selectedTags.value.join(","),
      tagOperator.value,
      isLiveResources.value,
      orderBy.value,
    ].join("-")

    const { data, error } = await useApiPost<
      BasesSearchResult | ResourcesSearchResult
    >(
      "search/",
      searchParams,
      { page: currentPage.value + 1 },
      null,
      false,
      false,
      // we pass a custom key because otherwise Nuxt might ignore duplicate requests
      // (when they're actually not duplicates because of different params)
      customKey
    )

    if (launchedAt < latestSearchLaunched) {
      // there has been another search in between the request and the response,
      // we can ignore these results
      return
    }

    if (!error.value) {
      nResults.value = data.value!.count
      possibleTags.value = data.value!.results.possibleTags
      emit("results", data.value)
      if (scrollToTop) {
        document
          .getElementById("search-results")
          ?.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, debounceDelay)
}

const onSelect = (tagId: number) => {
  selectedTags.value = [...selectedTags.value, tagId]
  doSearch()
}
const removeTag = (tagId: number) => {
  selectedTags.value = selectedTags.value.filter((tag) => tag !== tagId)
  focusedCategory.value = 0
  doSearch()
}

const reset = () => {
  selectedTags.value = []
  textInput.value = ""
  doSearch()
}

const resetTags = () => {
  selectedTags.value = []
  doSearch()
}

const onRadioChange = (value: "OR" | "AND") => {
  tagOperatorInput.value = value
  tagOperator.value = value
  doSearch()
}

const onRadioFileBaseFilter = (value: "" | "create" | "save") => {
  resourceBaseFilterInput.value = value
  resourceBaseFilter.value = value
  doSearch()
}

const setSearchHistory = () => {
  resourceBaseFilterInput.value = ["create", "save"].includes(
    resourceBaseFilter.value
  )
    ? (resourceBaseFilter.value as "create" | "save")
    : ""
}

const isSaveSearchDisabled = computed(() => {
  if (!userStore.isLoggedIn) {
    return true
  }
  return (
    textInput.value === "" &&
    selectedTags.value.length === 0 &&
    tagOperator.value === "AND"
  )
})

onMounted(() => {
  setSearchHistory()
  doSearch()
})
</script>

<style scoped lang="sass">
.dropdown-holder
  display: flex
  margin-left: -16px
  flex-wrap: wrap
  margin-top: -16px
  *
    margin-left: 16px
    margin-top: 0
.btn-tab-activable
  flex-grow: 1
  flex-basis: 0
  font-size: 1rem
  font-weight: bold
  .ov-icon
    margin-right: 18px
.btn-tab-activable.-active
  background: var(--background-alt-blue-france)
  box-shadow: none

.toggle-container
  background: var(--background-alt-grey)
  border-radius: 16px
  padding: 6px
  padding-left: 0

.toggle-button
  color: var(--text-action-high-blue-france)
  font-weight: bold
  border-radius: 12px
  padding: 6px 16px
  font-size: 1rem

  &.-active
    color: white
    background: var(--text-action-high-blue-france)
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)

  img
    vertical-align: bottom
    height: 20px
    margin-bottom: 3px

  &:not(.-active):hover
    color: #0909B9
</style>

<style>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.small-radio-buttons .fr-fieldset__content {
  transform: scale(0.875);
  transform-origin: left;
}
.inline-radio legend {
  float: left;
  padding-right: 16px;
  font-weight: normal;
  font-size: 14px;
}
.fr-btn.reset-btn {
  margin-bottom: 0.75rem;
  margin-right: 0.75rem;
  font-size: 14px;
  color: var(--text-action-high-blue-france);
  padding: 4px 12px;
  line-height: initial;
  min-height: initial;
}

#search-container {
  display: unset;
  position: sticky;
  top: 0;
  z-index: 11;
}
</style>
