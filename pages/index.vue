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
        <div class="fr-col-6" style="color: var(--text-action-high-grey)">
          <p>
            La Base regroupe les ressources des professionnels du numérique
            d’intérêt général dont l’inclusion et la médiation numériques.
          </p>
          <p class="fr-mb-0">
            Vous pouvez naviguer au travers des bases des différents acteurs qui
            partagent leurs ressources et créer votre propre base.
          </p>
          <div>
            <NuxtLink
              to="/a-propos"
              class="no-underline no-append-ico fr-link fr-mt-2w"
            >
              <VIcon name="ri-arrow-right-line" class="fr-mr-1w" scale="0.8 " />
              En savoir plus
            </NuxtLink>
          </div>
        </div>
        <div class="fr-col-5 fr-text-mention--grey">
          <div class="fr-mb-9v">
            <p class="fr-mb-3v">
              La Base est une plateforme en amélioration continue grâce à vos
              retours et contributions. Vous pouvez nous écrire pour nous
              transmettre vos idées et vos remarques quant à l’évolution de La
              Base.
            </p>
            <a href="mailto:labase@anct.gouv.fr" class="no-underline">
              <DsfrButton class="fr-btn--sm" label="Nous contacter" />
            </a>
          </div>

          <template v-if="!userStore.isLoggedIn">
            <p class="fr-mb-3v">
              Pour pouvoir créer une base, renseigner, publier et enregistrer
              des fiches ressources vous devez bénéficier d’un compte.
            </p>
            <div>
              <DsfrButton
                class="fr-btn--sm"
                label="S'inscrire"
                @click="userStore.showSignUpModal = true"
              />
            </div>
          </template>
        </div>
      </div>

      <h2 class="fr-h4">Rechercher</h2>
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

    <Search @results="updateResults" />

    <hr style="margin-bottom: -24px; margin-top: 24px" />

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
      <div
        id="search-results"
        style="display: flex; align-items: baseline"
        class="fr-mb-2w fr-mt-3w"
      >
        <div>
          <template v-if="nResults">
            {{ nResults }}
            {{ pluralize(["résultat"], nResults, true) }}
          </template>
          <template v-else> aucun résultat correspondant </template>
          <span v-if="searchedText"> pour {{ searchedText }}</span>
        </div>
      </div>

      <div class="fr-mb-4w">
        <div v-if="resultType === 'bases'" class="bases-holder">
          <BaseMiniature v-for="base of results" :key="base.id" :base="base" />
        </div>
        <div v-if="resultType === 'resources'" class="resource-grid">
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Base, GenericSearchResult, Resource } from "~/composables/types"
import { computed, onMounted } from "vue"
import { pluralize } from "~/composables/strUtils"
import { useRoute, useRouter } from "vue-router"
import { useAlertStore } from "~/stores/alertStore"
import { useUserStore } from "~/stores/userStore"
import { useLoadingStore } from "~/stores/loadingStore"
import { paginationFromNResults } from "~/composables/pagination"

definePageMeta({
  layout: false,
  title: "Base",
})

const userStore = useUserStore()
const loadingStore = useLoadingStore()

const router = useRouter()
const route = useRoute()

const results = ref<Base[] | Resource[]>([])
const searchedText = ref("")
const pageSize = 12

const dataType = computed<string>({
  get: () => <string>route.query.dataType || "resources",
  set(newDataType: string) {
    router.replace({ query: { ...route.query, dataType: newDataType } })
  },
})

const resultType = ref(dataType.value)

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
  resultType.value = newResults.results.dataType
  results.value = newResults.results.objects
  nResults.value = newResults.count
}

onMounted(() => {
  // display email confirmation when appropriate
  const route = useRoute()
  if (route.query.emailConfirmed) {
    const alertStore = useAlertStore()
    alertStore.alert("Email confirmé")
  }
})

// pagination
const pages = computed(() => {
  return paginationFromNResults(nResults.value)
})
const onCurrentPageChange = (page: number) => {
  currentPage.value = page
}
</script>

<style scoped lang="sass">
.toggleButton
  border-bottom: 2px solid var(--text-title-blue-france)

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
  margin-left: -32px
  flex-wrap: wrap
  margin-top: 16px
  *
    margin-left: 32px
    margin-top: 0
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
