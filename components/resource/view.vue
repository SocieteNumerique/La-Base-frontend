<template>
  <div>
    <div class="fr-pt-5w" style="background: var(--background-alt-grey)">
      <div class="fr-container">
        <div class="fr-grid-row" style="align-items: stretch">
          <div class="fr-col-md-3 fr-pr-3w">
            <ImageResized
              :resizable-image="resource?.profileImage"
              format="miniature"
              :dimensions="{ width: '278px', height: '200px' }"
              default-image="resource"
            />
          </div>
          <div class="fr-col-md-9" style="display: flex">
            <div
              style="
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                width: 100%;
              "
            >
              <h1 style="max-width: 800px" class="fr-mb-0 fr-h3">
                {{ resource?.title }}
              </h1>

              <div>
                <div
                  class="fr-mb-2w"
                  style="display: flex; flex-direction: row"
                >
                  <div class="fr-text--sm fr-m-0">
                    Fiche publiée dans
                    <NuxtLink
                      :to="'/base/' + resource?.rootBase"
                      class="fr-text-label--blue-france no-underline underlined-on-hover"
                    >
                      {{ resource?.rootBaseTitle }}
                    </NuxtLink>
                  </div>
                  <div class="fr-ml-3w fr-text--sm fr-m-0">
                    <template
                      v-if="
                        resource?.canWrite &&
                        (resource?.creator?.firstName ||
                          resource?.creator?.lastName)
                      "
                    >
                      Créée par
                      {{ resource?.creator?.firstName }}
                      {{ resource?.creator?.lastName }}
                    </template>
                  </div>
                </div>
                <hr class="fr-pb-2w" />
                <div class="has-children-space-between">
                  <div class="is-flex">
                    <div class="stat">
                      <span class="fr-h6">{{
                        resource?.stats.visitCount
                      }}</span>
                      <span class="fr-text--sm fr-ml-1w">{{
                        pluralize(["vue"], resource?.stats.visitCount)
                      }}</span>
                    </div>
                    <div class="stat">
                      <span class="fr-h6">{{ resource?.stats.pinCount }}</span>
                      <span class="fr-text--sm fr-ml-1w">{{
                        pluralize(["enregistrement"], resource?.stats.pinCount)
                      }}</span>
                    </div>
                  </div>
                  <div
                    class="is-flex fr-text--xs fr-m-0"
                    style="align-items: flex-end"
                  >
                    <div>Fiche créée le {{ $date(resource?.created) }}</div>
                    <div class="fr-ml-4w">
                      Fiche modifiée le {{ $date(resource?.modified) }}
                    </div>
                    <div class="fr-ml-4w">
                      Statut : {{ stateLabel[resource?.state] }}
                    </div>
                  </div>
                </div>
                <hr style="padding-bottom: 1px" class="fr-mt-2w" />
              </div>
            </div>
          </div>
        </div>
        <div class="has-children-space-between fr-py-3v">
          <div>
            <IntroTooltip slug="RESOURCE_SHARE" style="display: inline-block">
              <ShareButton :link="route.fullPath">
                <RoundButton
                  icon="ri-share-line"
                  class="fr-pl-0"
                  label="Partager"
                />
              </ShareButton>
            </IntroTooltip>
            <IntroTooltip slug="REPORT_RESOURCE" style="display: inline-block">
              <RoundButton
                icon="ri-alert-line"
                label="Signaler"
                @click="showReportModal = true"
              />
            </IntroTooltip>

            <ReportSimpleModal
              v-if="showReportModal"
              :id="resource.id"
              instance-type="Resource"
              @close="showReportModal = false"
            />

            <!-- TODO re-add these -->
            <template v-if="false">
              <RoundButton icon="ri-equalizer-line" label="Évaluer" disabled />
              <RoundButton
                icon="ri-download-line"
                label="Télécharger"
                disabled
              />
              <RoundButton icon="ri-share-line" label="Signaler" disabled />
            </template>
          </div>

          <div
            class="is-flex"
            style="align-items: center; justify-content: space-between"
          >
            <div class="is-flex" style="align-items: center">
              <IntroTooltip slug="EDIT_RESOURCE">
                <NuxtLink
                  v-if="resource?.canWrite"
                  :to="editionLink"
                  class="no-underline"
                >
                  <DsfrButton
                    icon="ri-edit-line"
                    label="Éditer"
                    class="fr-btn--sm"
                    secondary
                  />
                </NuxtLink>
              </IntroTooltip>

              <PinMenu
                v-if="resource"
                v-model="resource.pinnedInBases"
                :instance-id="resource?.id"
                :root-base-id="resource?.rootBase"
                class="fr-ml-2w"
                instance-type="resource"
              />
            </div>
          </div>
        </div>
        <hr style="padding-bottom: 1px" />
      </div>
    </div>

    <div class="fr-container fr-mt-5w">
      <div class="fr-mb-11v">
        <div class="fr-grid-row">
          <div class="fr-col-3">
            <nav
              class="fr-sidemenu fr-sidemenu--sticky"
              role="navigation"
              aria-label="Menu latéral"
            >
              <div class="fr-sidemenu__inner">
                <button
                  class="fr-sidemenu__btn"
                  aria-controls="fr-sidemenu-wrapper"
                  aria-expanded="false"
                >
                  Menu
                </button>
                <div id="fr-sidemenu-wrapper" class="fr-collapse">
                  <ul class="fr-sidemenu__list">
                    <li
                      v-for="menu in navigationMenus"
                      :key="menu.key"
                      class="fr-sidemenu__item"
                      :class="
                        activeMenu === menu.key
                          ? 'fr-sidemenu__item--active'
                          : ''
                      "
                    >
                      <button
                        :aria-current="activeMenu === menu.key ? 'page' : null"
                        class="fr-sidemenu__link"
                        @click="selectMenu(menu.key)"
                      >
                        {{ menu.name }}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
          <div class="fr-col-9">
            <div v-if="activeMenu == 'informations'" id="informations">
              <h2
                v-if="resource?.resourceCreatedOn"
                class="fr-text--bold fr-mb-3v fr-text--md"
              >
                Date de création
              </h2>
              <p>{{ resource?.resourceCreatedOn }}</p>
              <hr class="fr-mt-3w fr-pb-3w" />
              <ResourceCredits />
              <hr class="fr-mt-3w fr-pb-1w" />
              <IndexTable
                v-if="resource && !resource.isShort"
                :element="resource"
              />
            </div>
            <div v-if="activeMenu == 'resource'" id="resource">
              <div class="fr-grid-row">
                <div class="fr-col-md-8">
                  <template v-if="resource?.description">
                    <h2 class="fr-text--md fr-text--bold">Description</h2>
                    <div class="fr-col-11" style="white-space: pre-line">
                      {{ resource?.description }}
                    </div>
                  </template>
                </div>
              </div>

              <div class="fr-grid-row">
                <div class="fr-col-md-8">
                  <hr class="fr-mb-9v fr-mt-6v" style="padding-bottom: 1px" />
                  <ResourceContents />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { computed, onBeforeMount } from "vue"
import RoundButton from "~/components/roundButton.vue"
import IndexTable from "~/components/indexTable.vue"
import { getResourceIfNotExists } from "~/composables/resource"
import { DsfrButton } from "@gouvminint/vue-dsfr"
import { pluralize } from "~/composables/strUtils"
import { stateLabel } from "~/composables/constants"

const props = defineProps({
  isPreview: { type: Boolean, default: false },
})
const resourceStore = useResourceStore()
const route = useRoute()

const activeMenu = ref("resource")
const showReportModal = ref<boolean>(false)
const editionLink = computed(
  () => `/ressource/${resourceStore.currentId}/edition`
)
const selectMenu = (key: string) => {
  activeMenu.value = key
  const el = document.getElementById(key)
  if (el) {
    el.scrollIntoView({ behavior: "smooth" })
  }
}

const navigationMenus = [
  {
    key: "resource",
    name: "Ressource",
  },
  {
    key: "informations",
    name: "Informations",
  },
]

const handleIntersect = (entries: IntersectionObserverEntry[]) => {
  // take entry that is the upper-most one amongst those with max intersectionRatio
  const ratios = entries.map((entry) => entry.intersectionRatio)
  const maxRatio = Math.max(...ratios)
  const entriesWithMaxRatio = entries.filter(
    (entry) => entry.intersectionRatio == maxRatio
  )
  // select the top-most one
  const distancesFromTop = entriesWithMaxRatio.map(
    (entry) => entry.intersectionRect.y
  )
  const indexOfMinDistanceFromTop = distancesFromTop.indexOf(
    Math.max(...distancesFromTop)
  )

  activeMenu.value = entriesWithMaxRatio[indexOfMinDistanceFromTop].target.id
}

const resource = computed(() => {
  return resourceStore.current
})

if (process.server && !props.isPreview) {
  getResourceIfNotExists()
}
onBeforeMount(async () => {
  if (!props.isPreview) {
    await getResourceIfNotExists()
  }
})
</script>

<style>
.stat {
  margin-left: -12px;
}

.stat + .stat {
  margin-left: 12px;
}

.stat * {
  margin-left: 12px;
}
</style>
