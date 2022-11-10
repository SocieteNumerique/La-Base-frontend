<template>
  <NuxtLayout name="default">
    <template #header>
      <div class="fr-background-alt--grey fr-pb-2w fr-pt-6w">
        <div class="fr-container">
          <div class="brand fr-mb-3v">
            <ImageResized
              :resizable-image="base?.profileImage"
              class="profile"
              format="index"
              circle
              default-image="base"
            />
            <ImageResized
              :resizable-image="base?.coverImage"
              class="cover"
              :dimensions="{ width: '100%', height: '100%' }"
              format="index"
              overlay
            />
          </div>
          <div
            v-if="base?.canWrite"
            class="has-children-space-between fr-text--sm fr-text-default--grey fr-mb-2v pre-header"
          >
            <div>
              <div>Statut : {{ stateLabel[base?.state] }}</div>
            </div>
            <BaseSettings />
          </div>
          <h1 style="max-width: 800px" class="fr-h2 fr-mb-1w">
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
          <div
            style="border-bottom: 1px solid var(--border-default-grey)"
            class="fr-my-2w"
          />
          <div class="has-children-space-between">
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
            <div style="padding-top: 3px">
              <DsfrButton
                icon="ri-add-line"
                label="Ajouter une fiche"
                @click="onAddResourceClick"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="fr-header fr-mb-5w" style="box-shadow: none">
      <div class="fr-header__body fr-header__nav">
        <div class="fr-container">
          <div class="fr-header__body-row">
            <ul class="fr-links-group">
              <li>
                <NuxtLink
                  :aria-current="currentTab === 'presentation' ? 'page' : null"
                  @click="currentTab = 'presentation'"
                >
                  <button>Présentation</button>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :aria-current="currentTab === 'collections' ? 'page' : null"
                  @click="currentTab = 'collections'"
                >
                  <button>Collections</button>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :aria-current="currentTab === 'resources' ? 'page' : null"
                  @click="currentTab = 'resources'"
                >
                  <button>Fiches</button>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <BasePresentation v-if="currentTab === 'presentation'" />

    <template v-else>
      <Search v-if="currentTab === 'resources'" @results="updateResults" />

      <div class="fr-container fr-mt-5w">
        <BaseResources :base="base" :resources-result="resourcesResult" />
      </div>
    </template>

    <ResourceCreationModal
      v-if="showAddResourceModal"
      :base-id="base.id"
      @close="showAddResourceModal = false"
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
import { mobileOrTabletCheck } from "~/composables/mobileCheck"
import { stateLabel } from "~/composables/constants"
import { useFullWidth } from "~/composables/useFullWidth"

definePageMeta({
  layout: false,
  title: "Base",
})

useFullWidth()

const route = useRoute()
const router = useRouter()
const baseStore = useBaseStore()
const tagStore = useTagStore()
const resourcesResult = ref<SearchResult<Resource>>({
  count: 0,
  results: { objects: [], possibleTags: [], dataType: "resources", text: "" },
})

const currentTab = computed<"presentation" | "resources" | "collections">({
  get: () =>
    <"presentation" | "resources" | "collections" | "">route.query.tab ||
    "presentation",
  set: (type: "presentation" | "resources" | "collections") =>
    router.push({ query: { ...route.query, tab: type } }),
})

const base = computed(() => {
  return baseStore.current
})

const showAddResourceModal = ref<boolean>(false)
const onAddResourceClick = () => {
  showAddResourceModal.value = true
}

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

if (process.server) {
  getBaseIfNotExists()
}
onBeforeMount(async () => {
  // prefill email if exists
  if (route.query.email && !mobileOrTabletCheck()) {
    const userStore = useUserStore()
    userStore.prefillEmail = <string>route.query.email
    router.replace({ path: route.path, query: {} })
  }

  // fetch base
  const { error } = await getBaseIfNotExists()

  // if we have no access to this base, redirect to home or login
  if (error.value) {
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
    return
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
</script>

<style lang="sass" scoped>
.stat
  margin-left: -12px

.stat + .stat
  margin-left: 12px

.stat *
  margin-left: 12px
</style>

<style lang="sass">
.brand
  position: relative

  .profile
    position: absolute
    top: 53px
    left: 68px
    z-index: 10

  .cover
    height: 250px
</style>
