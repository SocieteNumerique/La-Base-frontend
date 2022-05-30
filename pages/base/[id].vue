<template>
  <NuxtLayout name="default">
    <template #header>
      <div class="fr-background-alt--grey fr-pb-4w fr-pt-10w">
        <div class="fr-container">
          <h1 style="max-width: 800px">{{ base?.title }}</h1>
          <div class="has-children-space-between">
            <div>Base créée par ...</div>
            <div class="is-flex">
              <div>Base créée le {{ $date(base?.created) }}</div>
              <div class="fr-ml-4w">
                Base modifiée le {{ $date(base?.modified) }}
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
            <div class="is-flex">
              <DsfrBadge label="2 signalements erreur type 3" type="warning" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <div>
      <RoundButton icon="ri-share-line" label="Partager" />
      <RoundButton icon="ri-equalizer-line" label="Évaluer" disabled />
      <RoundButton icon="ri-download-line" label="Télécharger" disabled />
      <RoundButton icon="ri-share-line" label="Signaler" disabled />
    </div>
    <div
      style="border-bottom: 1px solid var(--border-default-grey)"
      class="fr-my-3w"
    ></div>
    <div class="fr-grid-row">
      <div class="fr-col-3"></div>
      <div class="fr-col-9">
        <div>
          <h2 class="fr-h4">Ressources</h2>
          <ul>
            <li v-for="resourceId in base.resources" :key="resourceId">
              <NuxtLink :to="'/ressource/' + resourceId + '/edition'">{{
                resourceStore.resourcesById[resourceId].title
              }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { useRoute } from "vue-router"
import { computed, onMounted } from "vue"
import RoundButton from "~/components/roundButton.vue"
import IndexTable from "~/components/indexTable.vue"
import { useBaseStore } from "~/stores/baseStore"

definePageMeta({
  layout: false,
  title: "Base",
})
const route = useRoute()
const resourceStore = useResourceStore()
const baseStore = useBaseStore()

const getBaseIfNotExists = (): void => {
  const baseId = parseInt(route.params.id)
  baseStore.currentId = baseId
  if (!baseStore.basesById[baseId] || baseStore.basesById[baseId].isShort) {
    baseStore.getBase(baseId)
  }
}

const base = computed(() => {
  return baseStore.current
})

if (process.server) {
  getBaseIfNotExists()
}
onMounted(() => {
  getBaseIfNotExists()
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
