<template>
  <div class="miniature-container fr-text--xs">
    <CollectionEdit
      v-if="editable & isEditModalOpen"
      v-model="collection"
      @discard="collection = { ...savedCollection }"
      @exit="isEditModalOpen = false"
    />
    <div class="fr-grid-row fr-p-2w">
      <button
        v-if="editable"
        class="fr-btn--tertiary-no-outline"
        @click="isEditModalOpen = true"
      >
        <VIcon :scale="0.85" name="ri-edit-line" />
      </button>
      <!--      <RoundButton icon="ri-share-line" />-->
      <PinMenu
        v-model="basesPinnedIn"
        :instance-id="collection?.id"
        :root-base-id="collection?.base"
        instance-type="collection"
        class="fr-ml-auto"
      />
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
const collectionStore = useCollectionStore()
const props = defineProps({
  collectionId: { type: Number, required: true },
  editable: { type: Boolean, default: false },
})

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
.miniature-container
  border: 1px solid var(--grey-975-75-active)
  display: block
  background: none

.preview
  background: var(--background-alt-grey)
  height: 320px
  display: flex
  flex-direction: column
  justify-content: center

  &:hover
    background-color: var(--background-default-grey)

.bordered
  border-top: 1px solid var(--grey-975-75-active)
  border-bottom: 1px solid var(--grey-975-75-active)
  color: var(--text-action-high-grey)
</style>
