<template>
  <div class="miniature-container fr-text--xs">
    <CollectionEdit
      v-if="editable & isEditModalOpen"
      :collection="savedCollection"
      @exit="isEditModalOpen = false"
    />
    <div class="fr-p-2w has-children-space-between">
      <button
        v-if="editable"
        class="fr-btn--tertiary-no-outline"
        aria-label="éditer"
        @click="isEditModalOpen = true"
      >
        <VIcon :scale="0.85" name="ri-edit-line" />
      </button>
      <div v-else />
      <div class="is-flex">
        <ShareButton :link="link" class="fr-mr-3w" />
        <PinMenu
          v-model="pinnedInBases"
          :instance-id="savedCollection?.id"
          :root-base-id="savedCollection?.base"
          class="fr-ml-auto"
          instance-type="collection"
        />
      </div>
    </div>
    <NuxtLink
      :to="{ query: { ...route.query, collection: savedCollection.id } }"
      class="preview bordered fr-p-4w"
    >
      <!-- insert snapshot here -->
      <div class="text">
        <h6 class="fr-mb-1v">{{ savedCollection.name }}</h6>
        <p class="fr-m-0 fr-text--xs">
          {{ nbResources }}
          {{ pluralize(["Fiche ressource", "Fiches ressources"], nbResources) }}
        </p>
        <p v-if="savedCollection.description" class="fr-mt-2w fr-mb-0">
          {{ savedCollection.description }}
        </p>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { useCollectionStore } from "~/stores/collectionStore"
import { PinStatus, Collection } from "~/composables/types"
import { pluralize } from "~/composables/strUtils"
import { watchOnce } from "@vueuse/shared"
import { useBaseStore } from "~/stores/baseStore"

const route = useRoute()
const baseStore = useBaseStore()
const collectionStore = useCollectionStore()
const props = defineProps({
  collectionId: { type: Number, required: true },
})
const editable = ref<boolean>(
  baseStore.current?.canWrite || baseStore.current?.canAddResources || false
)
const link = computed(
  () =>
    useRouter().resolve({
      name: "base-id",
      params: { id: baseStore.currentId },
      query: { ...route.query, collection: savedCollection.value.id },
    }).href
)

const savedCollection = computed<Collection>(
  () => collectionStore.collectionsById[props.collectionId]
)
const nbResources = computed<number>(
  () => savedCollection.value.resources?.length || 0
)

const pinnedInBases = computed<PinStatus[]>({
  get: () => savedCollection.value?.pinnedInBases || [],
  set(value: PinStatus[]) {
    collectionStore.refreshPinStatus(value, savedCollection.value.id)
  },
})

const isEditModalOpen = ref<boolean>(false)

watchOnce(isEditModalOpen, () => {
  const baseStore = useBaseStore()
  const baseId = savedCollection.value.base
  if (!baseStore.basesById[baseId] || baseStore.basesById[baseId].isShort) {
    baseStore.getBase(baseId)
  }
})
</script>

<style lang="sass" scoped>
.preview
  background: var(--background-alt-grey)
  height: 320px
  display: flex
  flex-direction: column
  justify-content: center
  &:hover
    background: var(--background-alt-grey)

.bordered
  border-top: 1px solid var(--grey-975-75-active)
  border-bottom: 1px solid var(--grey-975-75-active)
  color: var(--text-action-high-grey)
</style>
