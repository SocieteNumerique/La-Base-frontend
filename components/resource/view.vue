<template>
  <div>
    <div class="fr-background-alt--grey fr-pb-4w fr-pt-10w">
      <div class="fr-container">
        <h1 style="max-width: 800px" class="fr-mb-7w">{{ resource?.title }}</h1>
        <div class="has-children-space-between">
          <div>
            Fiche créée par
            <NuxtLink
              :to="'/base/' + resource?.rootBase"
              class="fr-text-label--blue-france no-underline"
            >
              {{ resource?.rootBaseTitle }}
            </NuxtLink>
          </div>
          <div class="is-flex fr-text--sm">
            <div>Fiche créée le {{ $date(resource?.created) }}</div>
            <div class="fr-ml-4w">
              Fiche modifiée le {{ $date(resource?.modified) }}
            </div>
          </div>
        </div>
        <!-- TODO re-add this and next div -->
        <hr />
        <div class="has-children-space-between">
          <div class="is-flex">
            <!--            <div class="stat">-->
            <!--              <span class="fr-h5">45</span>-->
            <!--              <span class="fr-text-label&#45;&#45;blue-france">enregistrements</span>-->
            <!--            </div>-->
            <div class="stat">
              <span class="fr-h5">{{ resource?.stats.visitCount }}</span>
              <span class="fr-text-label--blue-france">{{
                pluralize(["vue"], resource?.stats.visitCount)
              }}</span>
            </div>
          </div>
          <div v-if="resource?.reports" class="is-flex">
            <DsfrBadge label="2 signalements erreur type 3" type="warning" />
          </div>
        </div>
      </div>
    </div>

    <div class="fr-container fr-mt-2w">
      <div class="fr-mb-11v">
        <div
          class="is-flex"
          style="align-items: center; justify-content: space-between"
        >
          <div class="is-flex" style="align-items: center">
            <ShareButton :link="route.fullPath">
              <RoundButton icon="ri-share-line" label="Partager" />
            </ShareButton>
            <!-- TODO should show the report modal on click-->
            <a :href="mailToHref" class="no-underline">
              <RoundButton icon="ri-alert-line" label="Signaler" />
            </a>

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

          <div class="is-flex" style="align-items: center">
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
        <div
          style="border-bottom: 1px solid var(--border-default-grey)"
          class="fr-mt-1w fr-mb-5w"
        ></div>
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
          <div id="intersectionRoot" class="fr-col-9">
            <div id="informations">
              <h2 class="fr-mb-11v">Informations</h2>
              <h3 class="fr-h6 fr-mb-8v">Général</h3>
              <div class="fr-grid-row" style="justify-content: space-between">
                <div class="fr-col-8" style="white-space: pre-line">
                  {{ resource?.description }}
                </div>
                <div class="fr-col-3">
                  <p class="fr-text--bold fr-mb-0">
                    Date de création de la ressource
                  </p>
                  <p>{{ resource?.resourceCreatedOn }}</p>
                </div>
              </div>

              <h3 class="fr-h6 fr-mb-8v fr-mt-6w">Indexation</h3>
              <IndexTable
                v-if="resource && !resource.isShort"
                :element="resource"
              />
            </div>
            <div id="resource">
              <h2>Ressource</h2>
              <ResourceContents />
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

const props = defineProps({
  isPreview: { type: Boolean, default: false },
})
const resourceStore = useResourceStore()
const route = useRoute()

const activeMenu = ref("informations")
const showReportModal = ref<boolean>(false)
const editionLink = computed(
  () => `/ressource/${resourceStore.currentId}/edition`
)
const mailToHref = computed(() => {
  let toReturn = "mailto:labase@anct.gouv.fr"
  if (!resource.value) {
    return toReturn
  }
  const subject = `[La Base] Signalement pour la ressource "${resource.value.title}" (id ${resource.value.id})`
  let body: string
  if (process.client) {
    body = `Ce signalement concerne la ressource suivante : ${window.location.href}`
  } else {
    body = ""
  }
  return `${toReturn}?subject=${subject}&body=${body}`
})

const selectMenu = (key: string) => {
  activeMenu.value = key
  const el = document.getElementById(key)
  if (el) {
    el.scrollIntoView({ behavior: "smooth" })
  }
}

const navigationMenus = [
  {
    key: "informations",
    name: "Informations",
  },
  {
    key: "resource",
    name: "Ressource",
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
    const isResourceOK = await getResourceIfNotExists()
    // no need to observe if we're being redirected
    if (!isResourceOK) {
      return
    }
  }

  // observe scroll to update left menu
  // timeout to make sure elements actually exist
  setTimeout(() => {
    var options = {
      root: null,
      threshold: 0.1,
    }

    const observer = new IntersectionObserver(handleIntersect, options)
    const sections = ["informations", "resource"]
    sections.forEach((el: string) => {
      console.log("### observing", el)
      observer.observe(document.getElementById(el)!)
    })
  }, 1000)
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
