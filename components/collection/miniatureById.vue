<template>
  <div class="miniature-container fr-text--xs">
    <CollectionEdit
      v-if="editable && openedTab"
      :collection="savedCollection"
      :tab="openedTab"
      @exit="openedTab = null"
    />
    <div class="fr-p-2w has-children-space-between">
      <ShareButton :link="link" class="fr-mr-3w" />
      <div class="is-flex">
        <template v-if="editable">
          <button
            class="fr-btn--tertiary-no-outline fr-mr-3v"
            aria-label="Éditer la collection"
            title="Éditer la collection"
            @click="openedTab = 'general'"
          >
            <VIcon :scale="1" name="ri-edit-line" />
          </button>
          <button
            class="fr-btn--tertiary-no-outline fr-mr-3v"
            aria-label="gérer les fiches"
            title="Gérer les fiches"
            @click="openedTab = 'resources'"
          >
            <VIcon :scale="1" name="ri-file-line" />
          </button>
        </template>
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
      class="preview bordered fr-p-4w no-underline"
      style="border-bottom: none"
    >
      <ImageResized
        class="fr-mb-2w"
        :resizable-image="savedCollection?.profileImage"
        :dimensions="{ width: '100%', height: '193px' }"
        format="miniature"
        default-image="collection"
      />

      <div class="text" style="overflow-x: hidden">
        <h6 class="fr-mb-2w">{{ savedCollection.name }}</h6>
        <div class="fr-text--sm fr-m-0">
          Publiée dans
          <NuxtLink
            :to="'/base/' + rootBase.id"
            class="fr-text-label--blue-france"
          >
            {{ rootBase.title }}
          </NuxtLink>
        </div>
        <p class="fr-m-0 fr-text--sm">
          <span class="fr-text--lg fr-text--bold fr-mr-1w">{{
            nbResources
          }}</span>
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
import { PinStatus, Collection, Base } from "~/composables/types"
import { pluralize } from "~/composables/strUtils"
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

const rootBase = computed<Base>(
  () =>
    baseStore.basesById[
      collectionStore.collectionsById[props.collectionId].base
    ]
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

const openedTab = ref<"general" | "resources" | null>(null)

const hasOpenedTabBeenWatched = ref(false)
watch(openedTab, () => {
  if (hasOpenedTabBeenWatched.value) {
    return
  }
  hasOpenedTabBeenWatched.value = true
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
  min-height: 320px
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
