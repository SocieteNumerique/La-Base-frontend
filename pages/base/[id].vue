<template>
  <NuxtLayout name="default">
    <template #header>
      <div class="fr-background-alt--grey fr-pb-4w fr-pt-10w">
        <div class="fr-container">
          <h1 style="max-width: 800px">{{ base?.title }}</h1>
          <div class="has-children-space-between">
            type d'acteur <br />
            localisation base
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
            <div v-if="base?.reports" class="is-flex">
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
    <div>
      <h2 class="fr-h4">Ressources</h2>
      <div v-if="base?.canWrite" class="fr-mb-2w">
        <ResourceCreationModal
          v-if="showAddResourceModal"
          @close="showAddResourceModal = false"
        />
        <DsfrButton label="Ajouter une ressource" @click="onButtonClick" />
      </div>
      <div class="resource-grid">
        <div v-for="resourceId of base?.resources" :key="resourceId">
          <ResourceMiniatureById :resource-id="resourceId" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { computed, onMounted } from "vue"
import RoundButton from "~/components/roundButton.vue"
import { useBaseStore } from "~/stores/baseStore"

definePageMeta({
  layout: false,
  title: "Base",
})
const route = useRoute()
const baseStore = useBaseStore()

let showAddResourceModal = ref(false)
const onButtonClick = () => {
  showAddResourceModal.value = true
}

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

<style lang="sass" scoped>
.stat
  margin-left: -12px

.stat + .stat
  margin-left: 12px

.stat *
  margin-left: 12px
</style>
