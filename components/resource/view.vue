<template>
  <div>
    <div class="fr-background-alt--grey fr-pb-4w fr-pt-10w">
      <div class="fr-container">
        <div>Recommandations</div>
        <h1 style="max-width: 800px">{{ resource?.title }}</h1>
        <div class="has-children-space-between">
          <div>Fiche créée par ...</div>
          <div class="is-flex">
            <div>Fiche créée le {{ $date(resource?.created) }}</div>
            <div class="fr-ml-4w">
              Fiche modifiée le {{ $date(resource?.modified) }}
            </div>
          </div>
        </div>
        <div
          style="border-bottom: 1px solid var(--border-default-grey)"
          class="fr-my-3w"
        ></div>
        <div class="has-children-space-between">
          <div class="is-flex">
            <div class="stat">
              <span class="fr-h5">45</span>
              <span class="fr-text-label--blue-france">enregistrements</span>
            </div>
            <div class="stat">
              <span class="fr-h5">45</span>
              <span class="fr-text-label--blue-france">mentions</span>
            </div>
            <div class="stat">
              <span class="fr-h5">45</span>
              <span class="fr-text-label--blue-france">vues</span>
            </div>
          </div>
          <div v-if="resource?.reports" class="is-flex">
            <DsfrBadge label="2 signalements erreur type 3" type="warning" />
          </div>
        </div>
      </div>
    </div>

    <div class="fr-container fr-mt-4w">
      <div class="fr-mb-11v">
        <div class="is-flex">
          <ShareButton :link="route.fullPath">
            <RoundButton icon="ri-share-line" label="Partager" />
          </ShareButton>
          <RoundButton icon="ri-equalizer-line" label="Évaluer" disabled />
          <RoundButton icon="ri-download-line" label="Télécharger" disabled />
          <RoundButton icon="ri-share-line" label="Signaler" disabled />
          <PinMenu
            v-if="resource"
            v-model="resource.basesPinnedIn"
            :instance-id="resource?.id"
            :root-base-id="resource?.rootBase"
            class="fr-ml-auto"
            instance-type="resource"
          />
        </div>
        <div
          style="border-bottom: 1px solid var(--border-default-grey)"
          class="fr-my-3w"
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
              <h2 class="">Informations</h2>
              <h3 class="fr-h5">Général</h3>
              <div class="fr-grid-row">
                <div class="fr-col-8" style="white-space: pre-line">
                  {{ resource?.description }}
                </div>
                <div class="fr-col-4">
                  <p class="fr-text--bold">Date de création de la ressource</p>
                  <p>?</p>
                  <p class="fr-text--bold">Crédits de la ressource</p>
                  <p>
                    Base 1 <br />
                    Base 2
                  </p>
                </div>
              </div>

              <h3 class="fr-h5">Indexation</h3>
              <IndexTable
                v-if="resource && !resource.isShort"
                :tag-categories="tagStore.categories"
                :element="resource"
              />
            </div>
            <div id="resource">
              <h2>Ressource</h2>
              <ResourceContents />
            </div>
            <div id="sources">
              <h2 class="fr-text--disabled">Source</h2>
              <p class="fr-text--disabled">
                Fonctionnalité en cours de développement
              </p>
            </div>
            <div id="evaluations">
              <h2 class="fr-text--disabled">Évaluations</h2>
              <p class="fr-text--disabled">
                Fonctionnalité en cours de développement
              </p>
            </div>
            <div id="reports">
              <h2 class="fr-text--disabled">Signalements</h2>
              <p class="fr-text--disabled">
                Fonctionnalité en cours de développement
              </p>
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
import { useTagStore } from "~/stores/tagStore"

const props = defineProps({
  isPreview: { type: Boolean, default: false },
})
const tagStore = useTagStore()
const resourceStore = useResourceStore()
const route = useRoute()

const activeMenu = ref("informations")

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
  {
    key: "sources",
    name: "Sources",
  },
  {
    key: "label",
    name: "Label",
  },
  {
    key: "evaluations",
    name: "Évaluation",
  },
  {
    key: "reports",
    name: "Signalements",
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
    const sections = [
      "informations",
      "resource",
      "sources",
      "evaluations",
      "reports",
    ]
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
