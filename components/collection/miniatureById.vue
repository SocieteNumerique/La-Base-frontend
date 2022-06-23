<template>
  <div class="miniature-container fr-text--xs">
    <CollectionEdit
      v-if="editable & isEditModalOpen"
      v-model="collection"
      @discard="collection = { ...savedCollection }"
      @exit="isEditModalOpen = false"
    />
    <div class="fr-p-2w has-children-space-between">
      <button
        v-if="editable"
        class="fr-btn--tertiary-no-outline"
        @click="isEditModalOpen = true"
      >
        <VIcon :scale="0.85" name="ri-edit-line" />
      </button>
      <div v-else />
      <div class="is-flex">
        <ShareButton :link="link" class="fr-mr-3w" />
        <PinMenu
          v-model="basesPinnedIn"
          :instance-id="collection?.id"
          :root-base-id="collection?.base"
          class="fr-ml-auto"
          instance-type="collection"
        />
      </div>
    </div>
    <NuxtLink
      :to="{ query: { ...route.query, collection: collection.id } }"
      class="preview bordered fr-p-4w"
    >
      <!-- insert snapshot here -->
      <div class="text">
        <h6>{{ savedCollection.name }}</h6>
        {{ nbResources }}
        {{ pluralize(["Fiche ressource", "Fiches ressources"], nbResources) }}
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
const collection = ref<Collection>({ ...savedCollection.value })

const basesPinnedIn = computed<PinStatus[]>({
  get: () => collection.value.basesPinnedIn || [],
  set(value: PinStatus[]) {
    collectionStore.refreshPinStatus(value, collection.value.id)
  },
})

const isEditModalOpen = ref<boolean>(false)

watchOnce(isEditModalOpen, () => {
  const baseStore = useBaseStore()
  const baseId = collection.value.base
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
