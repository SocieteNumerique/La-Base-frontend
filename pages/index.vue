<template>
  <NuxtLayout name="default">
    <template #header>
      <div style="background: #e8edff" class="fr-py-4w">
        <div class="fr-container">
          <h1 class="fr-h1 fr-mb-0" style="max-width: 750px">
            Bienvenue sur La Base du numérique d’intérêt général
          </h1>
        </div>
      </div>
    </template>
    <div>
      <div class="fr-grid-row fr-mb-5w" style="justify-content: space-between">
        <div class="fr-col-6">
          <p>
            La Base regroupe les ressources des professionnels du numérique
            d’intérêt général dont l’inclusion et la médiation numériques.
          </p>
          <p class="fr-mb-0">
            Vous pouvez naviguer au travers des bases des différents acteurs qui
            partagent leurs ressources et créer votre propre base.
          </p>
          <div>
            <NuxtLink to="/a-propos" style="background: none">
              <DsfrButton
                class="fr-btn--tertiary-no-outline fr-pl-0"
                label="En savoir plus"
                icon="ri-arrow-right-line"
              />
            </NuxtLink>
          </div>
        </div>
        <div v-if="!userStore.isLoggedIn" class="fr-col-5">
          <p class="fr-mb-0">
            Pour pouvoir créer une base, renseigner, publier et enregister des
            fiches ressources vous devez bénéficier d’un compte.
          </p>
          <div>
            <DsfrButton
              class="fr-btn--tertiary-no-outline fr-pl-0 fr-btn--sm"
              label="Inscrivez-vous"
              icon="ri-arrow-right-line"
              @click="userStore.showSignUpModal = true"
            />
          </div>
        </div>
      </div>

      <h2 class="fr-h4">Découvrir</h2>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-6">
          <div
            class="dataTypeChooser flex-center"
            :class="dataType === 'resources' ? 'selected' : null"
            @click="updateDataType('resources')"
          >
            <div class="dataTypeIcon">
              <img
                alt="Chercher des ressources"
                class="fr-mr-5v"
                src="/img/home/ressources.svg"
              />
            </div>
            <div class="dataTypeContent">
              <h3 class="fr-h6">Les fiches ressources</h3>
              <p>
                Parcourez les fiches ressources créées par les acteurs de la
                plateforme.
              </p>
            </div>
          </div>
        </div>

        <div class="fr-col-6">
          <div
            class="dataTypeChooser flex-center"
            :class="dataType === 'bases' ? 'selected' : null"
            @click="updateDataType('bases')"
          >
            <div class="dataTypeIcon">
              <img
                alt="Chercher des bases"
                class="fr-mr-5v"
                src="/img/home/bases.svg"
              />
            </div>
            <div class="dataTypeContent">
              <h3 class="fr-h6">Les bases</h3>
              <p>
                Parcourez les bases des acteurs de la plateforme et leurs
                contenus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h2 class="fr-h4 fr-my-4w">Rechercher</h2>
    <div class="fr-search-bar fr-input-group">
      <input
        id="search"
        v-model="textInput"
        class="fr-input"
        type="text"
        style="max-width: 586px"
        placeholder="Rechercher sur toute la plateforme"
        @input="doSearch"
      />
      <button class="fr-btn">
        <VIcon name="ri-search-line" />
      </button>
    </div>

    <hr />

    <h3 class="fr-mb-0 fr-text--regular fr-text--md">
      Filtrer avec l'index officiel
    </h3>

    <ul class="fr-px-2w fr-pt-1w fr-tags-group">
      <li v-for="tagId in selectedTags" :key="tagId">
        <button class="fr-tag--dismiss fr-tag" @click="removeTag(tagId)">
          {{ tagStore.tagsById[tagId].name }}
        </button>
      </li>
    </ul>
    <div class="dropdown-holder">
      <TagDropdown
        v-for="category of tagCategories"
        :key="category.id"
        :category="category"
        :is-focused="focusedCategory == category.id"
        :selected-tags="selectedTags"
        :enabled-tags="tagOperator == 'AND' ? possibleTags : null"
        @focus="focusedCategory = category.id"
        @blur="focusedCategory = 0"
        @select="onSelect"
      />
    </div>
    <div class="fr-mt-4w">
      <DsfrRadioButtonSet
        v-model="tagOperator"
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

    <hr />
    <!-- is loading -->
    <template v-if="loadingStore.isLoading('search')">
      <div class="fr-p-5w" style="text-align: center">
        <div style="animation: spin 1.5s linear infinite">
          <VIcon scale="10" name="ri-loader-5-line" />
        </div>
      </div>
    </template>

    <!-- results -->
    <template v-else>
      <div style="display: flex; align-items: baseline" class="fr-mb-2w">
        <div class="fr-text--bold">
          <template v-if="nResults">
            {{ nResults }}
            {{ pluralize(["résultat"], nResults, true) }}
          </template>
          <template v-else> aucun résultat correspondant </template>
          <span v-if="searchedText"> pour {{ searchedText }}</span>
        </div>
        <div>
          <button class="fr-btn fr-btn--tertiary-no-outline" @click="reset">
            Réinitialiser la rechercher
          </button>
        </div>
      </div>

      <div class="fr-mb-4w">
        <div v-if="dataType === 'bases'" class="bases-holder">
          <BaseMiniature v-for="base of results" :key="base.id" :base="base" />
        </div>
        <div v-if="dataType === 'resources'" class="resource-grid">
          <ResourceMiniature
            v-for="(resource, index) of results"
            :key="resource.id"
            v-model="results[index].basesPinnedIn"
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useApiPost } from "~/composables/api"
import {
  BasesSearchResult,
  ResourcesSearchResult,
  Base,
  Resource,
} from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { DsfrRadioButtonSet } from "@laruiss/vue-dsfr"
import { computed, onMounted } from "vue"
import { useLoadingStore } from "~/stores/loadingStore"
import { pluralize } from "~/composables/strUtils"
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  layout: false,
  title: "Base",
})

const tagOperator = ref<"OR" | "AND">("AND")
const focusedCategory = ref(0)
const selectedTags = ref<number[]>([])

const tagStore = useTagStore()
const userStore = useUserStore()
const loadingStore = useLoadingStore()

const pageSize = 12

const results = ref<Base[] | Resource[]>([])
const nResults = ref<null | number>(null)
const textInput = ref("")
const searchedText = ref("")
const possibleTags = ref<number[]>([])
const dataType = ref<"resources" | "bases">("resources")
const updateDataType = (newDataType: "resources" | "bases") => {
  dataType.value = newDataType
  currentPage.value = 0
  doSearch()
}
const tagCategories = computed(() => {
  const filterKey = dataType.value === "resources" ? "Resource" : "Base"
  return tagStore.categories.filter(
    (category) => category.relatesTo === filterKey
  )
})
const doSearch = debounce(async () => {
  const { data, error } = await useApiPost<
    BasesSearchResult | ResourcesSearchResult
  >(
    "search/",
    {
      text: textInput.value,
      dataType: dataType.value,
      tags: selectedTags.value,
      tagOperator: tagOperator.value,
    },
    { page: currentPage.value + 1 }
  )
  if (!error.value) {
    results.value = data.value.results.objects
    nResults.value = data.value.count
    searchedText.value = data.value.results.text
    possibleTags.value = data.value.results.possibleTags
  }
}, 400)

const onSelect = (tagId: number) => {
  selectedTags.value.push(tagId)
  focusedCategory.value = 0
  currentPage.value = 0
  doSearch()
}
const removeTag = (tagId: number) => {
  selectedTags.value = selectedTags.value.filter((tag) => tag !== tagId)
  focusedCategory.value = 0
  currentPage.value = 0
  doSearch()
}

const reset = () => {
  selectedTags.value = []
  textInput.value = ""
  currentPage.value = 0
  doSearch()
}

const onRadioChange = (value: "OR" | "AND") => {
  tagOperator.value = value
  currentPage.value = 0
  doSearch()
}

onMounted(() => doSearch())

// pagination
const currentPage = ref(0)
const pages = computed(() => {
  if (nResults.value == null) {
    return []
  }
  if (nResults.value <= pageSize) {
    return []
  }
  let nPages = Math.ceil(nResults.value / pageSize)
  nPages = Math.min(nPages, 10) // maximum 10 pages
  const toReturn = [...Array(nPages).keys()]
    .map((number) => number + 1)
    .map((page) => ({
      label: String(page),
      title: `Page ${page}`,
      href: `?page=${page}`,
    }))
  console.log("### pages", toReturn)
  return toReturn
})
const onCurrentPageChange = (page: number) => {
  console.log("### page change", page)
  currentPage.value = page
  doSearch()
}
</script>

<style scoped lang="sass">
.dataTypeChooser
  display: flex
  cursor: pointer
  text-align: center
  border: 1px solid #CECECE
  &.selected
    background: #F5F5FE
    box-shadow: inset 0 0-2px 0 var(--border-action-high-blue-france)
    border: 1px solid transparent
  &:hover
    border-color: var(--text-title-blue-france)

.dataTypeIcon
  padding: 65px

.dataTypeContent
  padding-right: 65px
  text-align: left

.dropdown-holder
  display: flex
  margin-left: -40px
  flex-wrap: wrap
  *
    margin-left: 40px
    margin-top: 12px
</style>

<style>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
