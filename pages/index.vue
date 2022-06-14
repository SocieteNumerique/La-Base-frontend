<template>
  <NuxtLayout name="default">
    <template #header>
      <div style="background: #e8edff" class="fr-py-4w">
        <div class="fr-container">
          <h1 class="fr-h1 fr-mb-0">
            Bienvenue sur la Base de l’inclusion et de la médiation numérique
          </h1>
        </div>
      </div>
    </template>
    <div>
      <p>
        Cette base regroupent les ressources des professionnels du secteur de
        l’inclusion et de la médiation numérique. Vous pourrez naviguer au
        travers des bases des différents acteurs qui partagent leurs ressources
        et vous pourrez vous même créer votre propre base.
      </p>
      <h2 class="fr-h4">Découvrir</h2>
      <div class="dataTypeChooserHolder">
        <div
          class="dataTypeChooser"
          :class="dataType === 'resources' ? 'selected' : null"
          @click="updateDataType('resources')"
        >
          <div>
            <VIcon scale="3" name="ri-file-line" />
          </div>
          <h3 class="fr-h6">Les fiches ressources</h3>
          <p>
            Rapide descriptions de ce qu’est une fiche ressourcerapide de ce
            qu’est une fiche ressource
          </p>
        </div>
        <div
          class="dataTypeChooser"
          :class="dataType === 'bases' ? 'selected' : null"
          @click="updateDataType('bases')"
        >
          <div>
            <VIcon scale="3" name="ri-file-line" />
          </div>
          <h3 class="fr-h6">Les bases</h3>
          <p>
            Rapide descriptions de ce qu’est une fiche base ; rapide desc de ce
            qu’est une base
          </p>
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

    <h3 class="fr-h6 fr-mb-0">Filtrer avec l'index</h3>

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
          { label: 'Au moins un tag sélectionné ', value: 'OR' },
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
import { onMounted } from "vue"
import { useLoadingStore } from "~/stores/loadingStore"
import { pluralize } from "~/composables/strUtils"

definePageMeta({
  layout: false,
  title: "Base",
})

const tagOperator = ref<"OR" | "AND">("AND")
const focusedCategory = ref(0)
const selectedTags = ref<number[]>([])

const tagStore = useTagStore()
const loadingStore = useLoadingStore()
const results = ref<Base[] | Resource[]>([])
const nResults = ref<null | number>(null)
const textInput = ref("")
const searchedText = ref("")
const possibleTags = ref<number[]>([])
const dataType = ref<"resources" | "bases">("resources")
const updateDataType = (newDataType: "resources" | "bases") => {
  dataType.value = newDataType
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
  >("search/", {
    text: textInput.value,
    dataType: dataType.value,
    tags: selectedTags.value,
    tagOperator: tagOperator.value,
  })
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
  tagOperator.value = value
  doSearch()
}

onMounted(() => doSearch())
</script>

<style scoped lang="sass">
.dataTypeChooserHolder
  display: flex

.dataTypeChooser
  cursor: pointer
  text-align: center
  border: 1px solid #CECECE
  padding: 24px 8px 0px 8px
  &.selected
    background: #F5F5FE
    border: 1px solid #F5F5FE
  width: 383px

.dataTypeChooser + .dataTypeChooser
  margin-left: 24px

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
