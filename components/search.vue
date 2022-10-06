<template>
  <div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div
        :style="
          isSearchDeactivated
            ? 'pointer-events: none; filter: grayscale(1) opacity(0.5); user-select: none'
            : null
        "
        class="fr-col-6 fr-pt-0"
      >
        <div class="fr-search-bar fr-input-group fr-mt-4w">
          <input
            id="search"
            v-model="textInput"
            class="fr-input"
            type="text"
            placeholder="Rechercher sur toute la plateforme"
            @input="doSearch()"
          />
          <button class="fr-btn">
            <VIcon name="ri-search-line" />
          </button>
        </div>
      </div>
      <div
        v-if="showResourceCollectionsToggle"
        class="fr-col-6"
        style="align-items: flex-end; display: flex; justify-content: center"
      >
        <div class="fr-btns-group--xs is-flex" style="width: 100%">
          <button
            :class="{ '-active': view === 'resources' }"
            class="btn-tab-activable fr-btn--tertiary fr-p-2v fr-mr-3w"
            @click="view = 'resources'"
          >
            <VIcon name="ri-file-line" />
            Voir les fiches
          </button>
          <button
            :class="{ '-active': view === 'collections' }"
            class="btn-tab-activable fr-btn--tertiary fr-p-2v"
            @click="view = 'collections'"
          >
            <VIcon name="ri-folder-3-line" />
            Voir les collections
          </button>
        </div>
      </div>
    </div>

    <div v-if="!isSearchDeactivated" class="fr-mt-4w">
      <button
        class="fr-btn fr-btn--tertiary-no-outline fr-pl-0"
        :class="showFilters ? 'fr-btn--tertiary--active' : null"
        @click="showFilters = !showFilters"
      >
        Filtrer
        <span style="padding-left: 3px">
          <VIcon v-if="!showFilters" name="ri-arrow-down-s-line" />
          <VIcon v-if="showFilters" name="ri-arrow-up-s-line" />
        </span>
      </button>
      <button
        class="fr-btn fr-btn--tertiary-no-outline"
        style="margin-left: 12px"
        @click="reset"
      >
        Réinitialiser la recherche
      </button>
    </div>

    <template v-if="showFilters">
      <ul v-if="selectedTags.length" class="fr-pt-1w fr-mt-2w fr-tags-group">
        <li v-for="tagId in selectedTags" :key="tagId">
          <button
            class="fr-tag--dismiss fr-tag"
            :aria-label="`Retirer ${tagStore.tagsById[tagId].name}`"
            @click="removeTag(tagId)"
          >
            {{ tagStore.tagsById[tagId].name }}
          </button>
        </li>
      </ul>
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
      <div class="fr-mt-1w small-radio-buttons">
        <DsfrRadioButtonSet
          v-model="tagOperatorInput"
          name="tagOperator"
          :inline="true"
          :options="[
            { label: 'Tous les tags sélectionnés', value: 'AND' },
            { label: 'Au moins un des tags sélectionnés ', value: 'OR' },
          ]"
          :required="true"
          legend="Les résultats comportent"
          @update:model-value="onRadioChange"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useApiPost } from "~/composables/api"
import { debounce } from "~/composables/debounce"
import {
  BasesSearchResult,
  ResourcesSearchResult,
  Base,
  Resource,
  TagCategory,
} from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { DsfrRadioButtonSet } from "@gouvminint/vue-dsfr"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

definePageMeta({
  layout: false,
  title: "Base",
})

const tagOperatorInput = ref<"OR" | "AND">("AND")
const focusedCategory = ref(0)
const showFilters = ref(true)

const tagStore = useTagStore()
const router = useRouter()
const route = useRoute()

const results = ref<Base[] | Resource[]>([])
const textInput = ref<string>(<string>route.query.text || "")
const possibleTags = ref<number[]>([])

const emit = defineEmits(["results", "searchedText"])

const dataType = computed<"resources" | "bases">(() => {
  return <"resources" | "bases">route.query.dataType || "resources"
})

const view = computed<string>({
  get: () => (route.query.view as string) || "resources",
  set: (value) => router.push({ query: { ...route.query, view: value } }),
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

const isSearchDeactivated = computed(() => {
  return route.query.view === "collections"
})

const tagCategories = computed<TagCategory[]>(() => {
  const filterKey = dataType.value === "resources" ? "Resource" : "Base"
  return tagStore.categories.filter(
    (category) =>
      category.relatesTo?.includes(filterKey) &&
      !hiddenCategorySlugs.includes(category.slug)
  )
})

const showResourceCollectionsToggle = computed(() =>
  route.path.startsWith("/base")
)

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
      restrictToBase: route.params.id || null,
      live: isLiveResources.value,
    },
    { page: currentPage.value + 1 }
  )
  if (!error.value) {
    results.value = data.value.results.objects
    possibleTags.value = data.value.results.possibleTags
    emit("results", data.value)
    if (scrollToTop) {
      document
        .getElementById("search-results")!
        .scrollIntoView({ behavior: "smooth" })
    }
  }
}, 400)

const onSelect = (tagId: number) => {
  selectedTags.value = [...selectedTags.value, tagId]
  focusedCategory.value = 0
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
  margin-left: -32px
  flex-wrap: wrap
  margin-top: 16px
  *
    margin-left: 32px
    margin-top: 0
.btn-tab-activable
  flex-grow: 1
  flex-basis: 0
  font-size: 1rem
  font-weight: bold
  .ov-icon
    margin-right: 18px
.btn-tab-activable.-active
  background: #F5F5FE
  box-shadow: none
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
</style>
