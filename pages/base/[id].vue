<template>
  <NuxtLayout name="default">
    <template #header>
      <div class="fr-background-alt--grey fr-pb-3w fr-pt-6w">
        <div class="fr-container">
          <ImageResized
            :resizable-image="base?.profileImage"
            class="fr-mb-3v"
            width="large"
            circle
            default-image="base"
          />
          <div
            v-if="base?.canWrite"
            class="has-children-space-between fr-text--sm fr-text-default--grey fr-mb-2v pre-header"
          >
            <div>
              <div>Statut : {{ stateLabel[base?.state] }}</div>
            </div>
            <BaseSettings />
          </div>
          <h1 style="max-width: 800px" class="fr-h2 fr-mb-4w">
            {{ base?.title }}
            <VIcon
              v-if="base?.isCertified"
              title="Cette base est certifiée"
              aria-label="Cette base est certifiée"
              name="official-line-colored"
              :scale="1.1"
              style="position: relative; bottom: 7px"
            />
          </h1>
          <div class="is-flex base-meta">
            <button
              class="fr-btn--tertiary-no-outline fr-text-title--blue-france fr-mr-3w"
              @click="showAboutModal = true"
            >
              À propos
            </button>
            <DsfrTags
              v-if="participantTypes.length"
              :tags="participantTypes"
              class="fr-mr-3w participant-tags"
            />
            <div v-if="territory" class="territory">
              <VIcon class="fr-mr-2v" name="ri-map-pin-line" />{{ territory }}
            </div>
          </div>
          <div
            style="border-bottom: 1px solid var(--border-default-grey)"
            class="fr-my-3w"
          />
          <div class="has-children-space-between">
            <div class="is-flex" style="align-items: center">
              <div class="stat">
                <span class="fr-text--xl fr-text--bold">{{
                  base?.visitCount
                }}</span>
                <span class="fr-text-label--blue-france">vues</span>
              </div>
            </div>
            <div>
              <a
                v-if="base?.contact"
                :href="mailToHrefContact"
                class="no-underline"
              >
                <RoundButton icon="ri-mail-line" label="Contacter" />
              </a>
              <ShareButton :link="route.fullPath">
                <RoundButton icon="ri-share-line" label="Partager" />
              </ShareButton>
              <!-- <RoundButton icon="ri-equalizer-line" label="Évaluer" disabled />-->
              <!-- <RoundButton icon="ri-download-line" label="Télécharger" disabled />-->
              <!-- TODO should show the report modal on click-->
              <a :href="mailToHrefReport" class="no-underline">
                <RoundButton icon="ri-alert-line" label="Signaler" />
              </a>
              <ReportSimpleModal
                v-if="showReportModal"
                :id="base.id"
                instance-type="Base"
                @close="showReportModal = false"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <Search
      :style="
        isSearchDeactivated
          ? 'pointer-events: none; filter: grayscale(1) opacity(0.5); user-select: none'
          : null
      "
      @results="updateResults"
    />

    <div
      id="search-results"
      style="border-bottom: 1px solid var(--border-default-grey)"
      class="fr-my-3w"
    ></div>

    <BaseResources :base="base" :resources-result="resourcesResult" />

    <BaseAbout
      v-if="showAboutModal"
      :participant-types="participantTypes"
      :base="base"
      :territory="territory"
      @close="showAboutModal = false"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { computed, onBeforeMount } from "vue"
import RoundButton from "~/components/roundButton.vue"
import { useBaseStore } from "~/stores/baseStore"
import { useUserStore } from "~/stores/userStore"
import { useAlertStore } from "~/stores/alertStore"
import { useTagStore } from "~/stores/tagStore"
import { useRegisterVisit } from "~/composables/visits"
import { Resource, SearchResult } from "~/composables/types"

definePageMeta({
  layout: false,
  title: "Base",
})
const route = useRoute()
const router = useRouter()
const baseStore = useBaseStore()
const tagStore = useTagStore()
const showAboutModal = ref(false)
const resourcesResult = ref<SearchResult<Resource>>({
  count: 0,
  results: { objects: [], possibleTags: [], dataType: "resources", text: "" },
})

const showReportModal = ref<boolean>(false)

const updateResults = (newResults: SearchResult<Resource>) => {
  resourcesResult.value = newResults
}

const participantTypes = computed<{ label: string }[]>(
  () =>
    base.value?.participantTypeTags?.map((tagId: number) => {
      return { label: tagStore.tagsById[tagId]?.name, small: true }
    }) || []
)
const territory = computed<string>(() =>
  (
    base.value?.territoryTags?.map((id) => tagStore.tagsById[id].name) || []
  ).join(", ")
)
const isSearchDeactivated = computed(() => {
  // TODO search should be deactivated within the component with LB-148
  //  keeping for now for the filters
  return false
  return route.query.view === "collections"
})

const getBaseIfNotExists = async () => {
  const baseId = parseInt(<string>route.params.id)
  baseStore.currentId = baseId
  if (!baseStore.basesById[baseId] || baseStore.basesById[baseId].isShort) {
    return await baseStore.getBase(baseId)
  }
  return Promise.resolve({
    error: ref(false),
    data: ref(baseStore.basesById[baseId]),
  })
}

const base = computed(() => {
  return baseStore.current
})

if (process.server) {
  getBaseIfNotExists()
}
onBeforeMount(async () => {
  // prefill email if exists
  if (route.query.email) {
    const userStore = useUserStore()
    userStore.prefillEmail = <string>route.query.email
    router.replace({ path: route.path, query: {} })
  }

  // fetch base
  const { error } = await getBaseIfNotExists()

  // if we have no access to this base, redirect to home or login
  if (error.value) {
    console.log("### error", error.value)
    const alertStore = useAlertStore()
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      alertStore.alert(
        "Veuillez vous connecter pour avoir accès à cette base",
        "",
        "warning"
      )
      router.replace({ path: "/connexion", query: { next: route.path } })
    } else {
      alertStore.alert("Vous n'avez pas accès à cette base", "", "warning")
      router.replace("/")
    }
  }

  useRegisterVisit("base", baseStore.currentId!)
})

const mailToHrefContact = computed(() => {
  if (!base.value?.contact) {
    return ""
  }
  let toReturn = `mailto:${base.value.contact}`
  const subject = `[La Base] Contact à propos de la base "${base.value.title}" (id ${base.value.id})`
  return `${toReturn}?subject=${subject}`
})

const mailToHrefReport = computed(() => {
  let toReturn = "mailto:labase@anct.gouv.fr"
  if (!base.value) {
    return toReturn
  }
  const subject = `[La Base] Signalement pour la base "${base.value.title}" (id ${base.value.id})`
  let body: string
  if (process.client) {
    body = `Ce signalement concerne la base suivante : ${window.location.href}`
  } else {
    body = ""
  }
  return `${toReturn}?subject=${subject}&body=${body}`
})

const stateLabel = {
  public: "Public",
  private: "Privé",
  draft: "Invisible",
  restricted: "Restreint",
}
</script>

<style lang="sass" scoped>
.stat
  margin-left: -12px

.stat + .stat
  margin-left: 12px

.stat *
  margin-left: 12px

.base-meta
  align-items: center

  .territory
    color: black
    font-size: 0.75rem
</style>

<style lang="sass">
.base-meta .participant-tags .fr-tag
  margin-bottom: 0
</style>
