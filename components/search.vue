<template>
  <div id="search-container">
    <div
      class="fr-pb-3w fr-pt-4w"
      style="
        background: var(--background-alt-blue-france);
        position: sticky;
        top: 0;
        z-index: 1000000;
      "
      :style="
        showFilters ? null : 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)'
      "
    >
      <div class="fr-container">
        <div class="fr-grid-row">
          <div v-if="!isInBaseIndex" class="fr-col-md-4 fr-p-0">
            <div class="is-flex" style="align-items: center">
              <div class="toggle-container">
                <button
                  class="toggle-button"
                  :class="dataType === 'resources' ? '-active' : null"
                  @click="dataType = 'resources'"
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
                  @click="dataType = 'bases'"
                >
                  <img
                    alt="Chercher des bases"
                    class="fr-mr-3v"
                    src="/img/home/base-blue.svg"
                  />
                  <span>Bases</span>
                </button>
              </div>
            </div>
          </div>
          <div
            class="fr-col-md-8 fr-p-0 is-flex"
            :style="isInBaseIndex ? null : 'justify-content: space-between'"
          >
            <div>
              <div class="fr-search-bar fr-input-group">
                <input
                  id="search"
                  v-model="textInput"
                  class="fr-input"
                  type="text"
                  :placeholder="
                    isInBaseIndex
                      ? 'Rechercher dans toute la base'
                      : 'Rechercher dans toute la plateforme'
                  "
                  style="width: 308px"
                  @change="doSearch"
                  @keydown.enter="doSearch"
                />
                <button class="fr-btn" @click="doSearch">
                  <VIcon name="ri-search-line" />
                </button>
              </div>
            </div>
            <div :style="isInBaseIndex ? 'margin-left: 24px' : null">
              <button class="fr-btn" @click="showFilters = !showFilters">
                Filtrer
                <span style="padding-left: 3px">
                  <VIcon v-if="!showFilters" name="ri-arrow-down-s-line" />
                  <VIcon v-if="showFilters" name="ri-arrow-up-s-line" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showFilters"
      class="fr-pt-2w fr-pb-6w"
      style="box-shadow: rgb(0 0 0 / 25%) 0px 4px 4px"
    >
      <div class="fr-container">
        <ul v-if="selectedTags.length" class="fr-mb-2w fr-tags-group">
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
        <div class="fr-mt-3v">
          {{ nResults }} {{ pluralize(["résultat"], nResults) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApiPost } from "~/composables/api"
import { debounce } from "~/composables/debounce"
import {
  BasesSearchResult,
  ResourcesSearchResult,
  TagCategory,
} from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { DsfrRadioButtonSet } from "@gouvminint/vue-dsfr"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { pluralize } from "~/composables/strUtils"
import { onFocusOut } from "~/composables/focusOut"

definePageMeta({
  layout: false,
  title: "Base",
})

const tagOperatorInput = ref<"OR" | "AND">("AND")
const focusedCategory = ref(0)

const tagStore = useTagStore()
const router = useRouter()
const route = useRoute()

const nResults = ref(0)
const textInput = ref<string>(<string>route.query.text || "")
const possibleTags = ref<number[]>([])

// hide filters on outside click
onFocusOut(
  () => (showFilters.value = false),
  "search-container",
  () => showFilters.value
)

const emit = defineEmits(["results", "searchedText"])

const dataType = computed<"resources" | "bases">({
  get: () => <"resources" | "bases">route.query.dataType || "resources",
  set: (type: string) =>
    router.push({ query: { ...route.query, dataType: type } }),
})

const currentPage = computed<number>({
  get: () => Number(route.query.page) || 0,
  set(page: number) {
    updateRouterQuery({ page })
  },
})
const tagOperator = computed<string>({
  get: () => <string>route.query.tagOperator || "AND",
  set(newTagOperator: string) {
    updateRouterQuery({ tagOperator: newTagOperator, page: 0 })
  },
})
const orderBy = computed<string>({
  get: () => <string>route.query.orderBy || "-modified",
  set(newValue: string) {
    updateRouterQuery({ orderBy: newValue, page: 0 })
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
  },
})

const updateRouterQuery = (newQueryParams: any) => {
  router.replace({ query: { ...route.query, ...newQueryParams } })
}

watch(
  () => route.query,
  (query, oldQuery) => {
    if (query.dataType != oldQuery.dataType) {
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
const showFilters = ref(false)

const licenseTypeCategoryId = tagStore.tagCategoryIdsBySlug["license_01license"]
const hiddenCategorySlugs = ["license_02free", "license_01license"]

const doSearch = debounce(async (scrollToTop = false) => {
  const { data, error } = await useApiPost<
    BasesSearchResult | ResourcesSearchResult
  >(
    "search/",
    {
      text: textInput.value,
      dataType: dataType.value,
      tags: selectedTags.value,
      tagOperator: tagOperator.value,
      restrictToBase: (isInBaseIndex.value && route.params.id) || null,
      live: isLiveResources.value,
      orderBy: orderBy.value,
    },
    { page: currentPage.value + 1 }
  )
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
}, 400)

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

onMounted(() => {
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
  z-index: 100000;
  position: relative;
}
</style>
