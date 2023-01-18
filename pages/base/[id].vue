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
            class="has-children-space-between fr-text--sm fr-mb-2v pre-header"
          >
            <div style="display: flex; align-items: center">
              <div style="color: var(--text-mention-grey)">
                Statut : {{ stateLabel[base?.state] }}
              </div>
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
              <IntroTooltip slug="BASE_SHARE" style="display: inline-block">
                <ShareButton :link="route.fullPath">
                  <RoundButton
                    icon="ri-share-line"
                    class="fr-pl-0"
                    label="Partager"
                  />
                </ShareButton>
              </IntroTooltip>
              <!-- <RoundButton icon="ri-equalizer-line" label="Évaluer" disabled />-->
              <!-- <RoundButton icon="ri-download-line" label="Télécharger" disabled />-->
              <!-- TODO should show the report modal on click-->
              <IntroTooltip slug="REPORT_BASE" style="display: inline-block">
                <RoundButton
                  icon="ri-alert-line"
                  label="Signaler"
                  @click="showReportModal = true"
                />
              </IntroTooltip>
              <IntroTooltip
                v-if="base?.contact"
                slug="BASE_CONTACT"
                style="display: inline-block"
              >
                <a :href="mailToHrefContact" class="no-underline">
                  <RoundButton icon="ri-mail-line" label="Contacter" />
                </a>
              </IntroTooltip>
            </div>
            <div style="padding-top: 7px; display: flex">
              <IntroTooltip v-if="base?.canWrite" slug="CREATE_FICHE">
                <DsfrButton
                  icon="ri-add-line"
                  label="Ajouter une fiche"
                  class="fr-btn--sm"
                  @click="onAddResourceClick"
                />
              </IntroTooltip>
              <div class="fr-ml-2w">
                <BaseBookmarkButton v-if="base" :base-id="base?.id" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="fr-header" style="box-shadow: none">
      <div class="fr-header__body fr-header__nav">
        <div class="fr-container">
          <div class="fr-header__body-row" style="padding-left: 6px">
            <ul class="fr-links-group">
              <li>
                <IntroTooltip slug="PRESENTATION" style="display: flex">
                  <NuxtLink
                    :aria-current="
                      currentTab === 'presentation' ? 'page' : null
                    "
                    @click="currentTab = 'presentation'"
                  >
                    <button>Présentation</button>
                  </NuxtLink>
                </IntroTooltip>
              </li>
              <li>
                <IntroTooltip slug="TAB_FICHES">
                  <NuxtLink
                    :aria-current="currentTab === 'resources' ? 'page' : null"
                    style="height: 100%; display: inline-block"
                    @click="currentTab = 'resources'"
                  >
                    <button>Fiches</button>
                  </NuxtLink>
                </IntroTooltip>
              </li>
              <li>
                <IntroTooltip slug="TAB_COLLECTIONS">
                  <NuxtLink
                    :aria-current="currentTab === 'collections' ? 'page' : null"
                    style="height: 100%; display: inline-block"
                    @click="currentTab = 'collections'"
                  >
                    <button>Collections</button>
                  </NuxtLink>
                </IntroTooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <BasePresentation v-if="currentTab === 'presentation'" class="fr-mt-4w" />

    <template v-else>
      <Search v-if="currentTab === 'resources'" @results="updateResults" />

      <div class="fr-container fr-mt-4w">
        <BaseResources :base="base" :resources-result="resourcesResult" />
      </div>
    </template>

    <ResourceCreationModal
      v-if="showAddResourceModal"
      :base-id="base?.id"
      @close="showAddResourceModal = false"
    />
    <ReportSimpleModal
      v-if="showReportModal"
      :id="base?.id"
      instance-type="Base"
      @close="showReportModal = false"
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
  const subject = `[La Base] Contact à propos de la base "${base.value.title}" (id ${base.value?.id})`
  return `${toReturn}?subject=${subject}`
})
</script>

<style lang="sass" scoped>
.stat
  margin-left: -12px

.stat + .stat
  margin-left: 12px

.stat *
  margin-left: 12px

.fr-links-group
  a
    font-size: 14px
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
