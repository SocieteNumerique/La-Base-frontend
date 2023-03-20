<template>
  <div>
    <div class="fr-pt-5w" style="background: var(--background-alt-grey)">
      <div class="fr-container">
        <div
          v-if="resource?.stats.recommendationCount && resource?.canEvaluate"
          class="fr-pt-1v"
        >
          <div>
            <DsfrBadge
              :type="recoBadge.type"
              :label="recoBadge.label"
              :no-icon="true"
              :small="true"
              class="fr-mr-3v"
            />
            <span class="fr-text--sm fr-m">
              <span class="fr-text--bold">{{ recoBadge.pct }}%</span> de
              recommandation sur
              <span class="fr-text--bold">{{
                resource?.stats.recommendationCount
              }}</span>
              évaluations
            </span>
          </div>
          <hr class="fr-mt-2w" />
        </div>
        <div class="fr-grid-row" style="align-items: stretch">
          <div class="fr-col-md-3 fr-pr-3w">
            <ImageResized
              :resizable-image="resource?.profileImage"
              format="miniature"
              :dimensions="{ width: '278px', height: '200px' }"
              default-image="resource"
            />
          </div>
          <div
            class="fr-col-md-9 resource-title"
            style="display: flex; width: 100%"
          >
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
                      class="fr-text-label--blue-france"
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
                  <div class="is-flex" style="margin-left: 18px">
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
                    <div class="fr-ml-2w">
                      Fiche modifiée le {{ $date(resource?.modified) }}
                    </div>
                    <div class="fr-ml-2w">
                      Statut : {{ stateLabel[resource?.state] }}
                    </div>
                  </div>
                </div>
                <div class="only-print fr-mt-2w"></div>
                <hr style="padding-bottom: 1px" class="fr-mt-2w no-print" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isExporting" class="has-children-space-between fr-py-3v">
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
            <IntroTooltip
              v-if="resource?.canEvaluate && userStore.isLoggedIn"
              slug="RESOURCE_EVALUATE"
              style="display: inline-block"
            >
              <RoundButton
                icon="ri-equalizer-line"
                label="Évaluer"
                @click="showEvaluationModal = true"
              />
            </IntroTooltip>
            <IntroTooltip
              v-if="userStore.isLoggedIn"
              slug="RESOURCE_CONTRIBUTE"
              style="display: inline-block"
            >
              <RoundButton
                icon="ri-edit-box-line"
                label="Contribuer"
                @click="showContributeModal = true"
              />
            </IntroTooltip>
            <IntroTooltip slug="RESOURCE_EXPORT" style="display: inline-block">
              <RoundButton
                icon="ri-download-line"
                label="Exporter"
                @click="showExportModal = true"
              />
            </IntroTooltip>
            <IntroTooltip slug="REPORT_RESOURCE" style="display: inline-block">
              <RoundButton
                icon="ri-alert-line"
                label="Signaler"
                @click="showReportModal = true"
              />
            </IntroTooltip>
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

              <IntroTooltip slug="SAVE_IN_BASE" class="fr-ml-2w">
                <PinMenu
                  v-if="resource"
                  v-model="resource.pinnedInBases"
                  :instance-id="resource?.id"
                  :root-base-id="resource?.rootBase"
                  instance-type="resource"
                />
              </IntroTooltip>
            </div>
          </div>
        </div>
        <hr style="padding-bottom: 1px" />
      </div>
    </div>

    <div class="fr-container fr-mt-5w">
      <div class="fr-mb-11v">
        <div class="fr-grid-row">
          <div v-if="!isExporting" class="fr-col-3">
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
          <div :class="isExporting ? 'print-col-12' : 'fr-col-9'">
            <div v-if="isExporting" class="no-print fr-mb-2w print-wrapper">
              <DsfrButton
                label="Quitter le mode impression"
                icon="ri-arrow-left-line"
                class="fr-btn--lg fr-mr-4w"
                style="background: white"
                secondary
                @click="exitPrintMode"
              />
              <DsfrButton
                label="Impression (pdf)"
                icon="ri-printer-line"
                class="fr-btn--lg"
                @click="print"
              />
            </div>
            <div v-if="showSection('informations')" id="informations">
              <h2 class="only-print">Informations</h2>
              <h3
                v-if="resource?.resourceCreatedOn"
                class="fr-text--bold fr-mb-3v fr-text--md"
              >
                Date de création
              </h3>
              <p>{{ resource?.resourceCreatedOn }}</p>
              <hr class="fr-mt-3w fr-pb-3w" />
              <ResourceCredits />
              <hr class="fr-mt-3w fr-pb-1w" />
              <IndexTable
                v-if="resource && !resource.isShort"
                :element="resource"
              />
            </div>
            <div v-if="showSection('resource')" id="resource">
              <div class="fr-grid-row">
                <div class="fr-col-md-8">
                  <template v-if="resource?.description">
                    <h3 class="fr-text--md fr-text--bold">Description</h3>
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
            <ResourceEvaluationsView
              v-if="showSection('evaluations')"
              @evaluate="onEvaluation"
              @recommend="onRecommend"
              @not-recommend="onNotRecommend"
            />
          </div>
        </div>
      </div>
    </div>
    <ReportSimpleModal
      v-if="showReportModal"
      :id="resource.id"
      instance-type="Resource"
      @close="showReportModal = false"
    />
    <ResourceContributeModal
      v-if="showContributeModal"
      :id="resource.id"
      @close="showContributeModal = false"
    />
    <EvaluationModal
      v-if="showEvaluationModal"
      @close="showEvaluationModal = false"
    />
    <ResourceExportModal
      v-if="showExportModal"
      @close="showExportModal = false"
    />
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
import { useEvaluationStore } from "~/stores/evaluationStore"
import { useUserStore } from "~/stores/userStore"
import { useExportState } from "~/composables/exportState"

const props = defineProps({
  isPreview: { type: Boolean, default: false },
})
const evaluationStore = useEvaluationStore()
const resourceStore = useResourceStore()
const userStore = useUserStore()
const route = useRoute()
const { isExporting, selectedExport } = useExportState()

const activeMenu = ref("resource")
const showReportModal = ref<boolean>(false)
const showContributeModal = ref<boolean>(false)
const showEvaluationModal = ref<boolean>(false)
const showExportModal = ref<boolean>(false)
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
  {
    key: "evaluations",
    name: "Évaluations",
  },
]

const showSection = computed(() => (key: string) => {
  if (isExporting.value) {
    return selectedExport.value.indexOf(key) !== -1
  } else {
    return activeMenu.value === key
  }
})

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

const onEvaluation = (criterionSlug: string) => {
  evaluationStore.currentStep = "evaluate"
  evaluationStore.currentCriterionSlug = criterionSlug
  evaluationStore.evaluation.evaluation = -1
  showEvaluationModal.value = true
}
const onRecommend = (criterionSlug: string) => {
  evaluationStore.currentStep = "evaluate"
  evaluationStore.currentCriterionSlug = criterionSlug
  evaluationStore.evaluation.evaluation = "1"
  showEvaluationModal.value = true
}
const onNotRecommend = (criterionSlug: string) => {
  evaluationStore.currentStep = "evaluate"
  evaluationStore.currentCriterionSlug = criterionSlug
  evaluationStore.evaluation.evaluation = "0"
  showEvaluationModal.value = true
}
const print = () => {
  window.print()
}
const exitPrintMode = () => {
  isExporting.value = false
  // need timeout because otherwise the second query param change will
  // overwrite the first
  setTimeout(() => {
    selectedExport.value = []
  }, 200)
}

const recoBadge = computed<{ label: string; type: string }>(() => {
  const mean =
    resource.value?.stats?.recommendationMean == null
      ? 1
      : resource.value?.stats?.recommendationMean
  return recommendationBadge(mean * 100)
})
</script>

<style>
@media (max-width: 991px) {
  .resource-title {
    margin-top: 30px;
  }
}
.stat {
  margin-left: -18px;
}

.stat + .stat {
  margin-left: 18px;
}

.stat * {
  margin-left: 6px;
}
.print-wrapper {
  position: sticky;
  top: 10px;
  z-index: 100;
  text-align: center;
}
</style>
