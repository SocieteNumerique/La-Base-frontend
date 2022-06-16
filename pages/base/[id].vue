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

      <div class="is-flex flex-space-between fr-mb-4w">
        <div class="fr-btns-group--xs">
          <button
            :class="{ '-active': view === 'resources' }"
            class="btn-tab-activable fr-btn--tertiary-no-outline fr-p-2v fr-mr-5w"
            @click="view = 'resources'"
          >
            <VIcon name="ri-file-line" />
            Voir les fiches
          </button>
          <button
            :class="{ '-active': view === 'collections' }"
            class="btn-tab-activable fr-btn--tertiary-no-outline fr-p-2v"
            @click="view = 'collections'"
          >
            <VIcon name="ri-folder-3-line" />
            Voir les collections
          </button>
        </div>
        <div v-if="base?.canWrite">
          <DsfrButton
            v-show="view === 'resources'"
            :secondary="true"
            label="Ajouter une ressource"
            @click="onAddResourceClick"
          />
          <DsfrButton
            v-show="view === 'collections'"
            :secondary="true"
            label="Ajouter une collection"
            @click="onAddCollectionClick"
          />
          <ResourceCreationModal
            v-if="showAddResourceModal"
            @close="showAddResourceModal = false"
          />
          <CollectionNew
            v-if="showAddCollectionModal"
            @close="showAddCollectionModal = false"
            @new-collection="refreshCollections"
          />
        </div>
      </div>

      <template v-if="view === 'collections' && openCollectionId === undefined">
        <div class="resource-grid">
          <div v-for="collectionId of base?.collections" :key="collectionId">
            <CollectionMiniatureById
              :collection-id="collectionId"
              :editable="true"
            />
          </div>
        </div>
        <div v-if="!base.collections.length">
          Vous n’avez pas encore créé de collection de fiches ressources
        </div>
      </template>

      <template v-if="view === 'resources'">
        <div class="resource-grid">
          <div v-for="resourceId of base?.resources" :key="resourceId">
            <ResourceMiniatureById :resource-id="resourceId" />
          </div>
        </div>
      </template>

      <template v-if="view === 'collections' && openCollection">
        <h3 class="fr-h6 fr-mb-5w">
          <NuxtLink
            :to="{ query: { view: 'collections' } }"
            class="no-underline fr-text-title--blue-france"
          >
            <VIcon class="fr-mr-4w fr-my-auto" name="ri-arrow-left-line" />
          </NuxtLink>
          {{ openCollection.name }}
        </h3>

        <div class="resource-grid">
          <div
            v-for="resourceId of openCollection?.resources || []"
            :key="resourceId"
          >
            <ResourceMiniatureById :resource-id="resourceId" />
          </div>
        </div>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { computed, onMounted } from "vue"
import RoundButton from "~/components/roundButton.vue"
import { useBaseStore } from "~/stores/baseStore"
import { useCollectionStore } from "~/stores/collectionStore"
import { Collection } from "~/composables/types"

definePageMeta({
  layout: false,
  title: "Base",
})
const route = useRoute()
const router = useRouter()
const baseStore = useBaseStore()
const collectionStore = useCollectionStore()

const showAddResourceModal = ref<boolean>(false)
const showAddCollectionModal = ref<boolean>(false)
const onAddResourceClick = () => {
  showAddResourceModal.value = true
}
const onAddCollectionClick = () => {
  showAddCollectionModal.value = true
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

const view = computed<string>({
  get: () => (route.query.view as string) || "resources",
  set: (value) => router.push({ query: { view: value } }),
})
const openCollectionId = computed<number | undefined>(
  () => route.query.collection as unknown as number
)
const openCollection = computed<Collection | undefined>(() => {
  if (openCollectionId.value !== undefined)
    return collectionStore.collectionsById[openCollectionId.value]
  return undefined
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
