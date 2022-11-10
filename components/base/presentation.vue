<template>
  <div class="fr-container fr-mt-5w">
    <h2 class="fr-h3 fr-mb-5w">Présentation</h2>
    <div class="is-flex fr-mb-5w" style="align-items: center">
      <div class="stat">
        <span class="fr-text--xl fr-text--bold">{{ base?.visitCount }}</span>
        <span>vues</span>
      </div>
    </div>
    <div class="fr-grid-row">
      <div
        class="fr-col-md-7"
        style="
          border-right: 1px solid var(--border-default-grey);
          margin-right: 62px;
          padding-right: 62px;
        "
      >
        <p>
          {{ base?.description }}
        </p>
      </div>
      <div class="fr-col-md-4">
        <DsfrTags
          v-if="participantTypes.length"
          :tags="participantTypes"
          class="fr-mr-3w participant-tags"
        />
        <div v-if="territory" class="territory">
          <VIcon class="fr-mr-2v" name="ri-map-pin-line" />
          {{ territory }}
        </div>
      </div>
    </div>
    <hr class="fr-pb-4w fr-mt-9w" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-sm-6">
        <button
          class="fr-btn select-type-btn"
          @click="currentTab = 'collections'"
        >
          <img src="/img/home/collection-blue.svg" alt="" />
          <span>Voir les collections</span>
          <VIcon name="ri-arrow-right-line" />
        </button>
      </div>
      <div class="fr-col-sm-6">
        <button
          class="fr-btn select-type-btn"
          @click="currentTab = 'resources'"
        >
          <img src="/img/home/resource-blue.svg" alt="" />
          <span>Voir les fiches</span>
          <VIcon name="ri-arrow-right-line" />
        </button>
      </div>
    </div>
    <hr class="fr-pb-9w fr-mt-4w" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useBaseStore } from "~/stores/baseStore"
import { useTagStore } from "~/stores/tagStore"
import { useRouter } from "vue-router"

const baseStore = useBaseStore()
const tagStore = useTagStore()
const router = useRouter()

const base = computed(() => {
  return baseStore.current
})
const participantTypes = computed<{ label: string }[]>(
  () =>
    base.value?.participantTypeTags?.map((tagId: number) => {
      return { label: tagStore.tagsById[tagId]?.name, small: true }
    }) || []
)
const currentTab = computed<"presentation" | "resources" | "collections">({
  get: () =>
    <"presentation" | "resources" | "collections" | "">route.query.tab ||
    "presentation",
  set: (type: "presentation" | "resources" | "collections") =>
    router.push({ query: { ...route.query, tab: type } }),
})
</script>

<style scoped>
.select-type-btn {
  font-weight: bold;
  text-align: center;
  width: 100%;
  border-radius: 12px;
  display: inline-block;
  padding: 8px 0;
}
.select-type-btn img {
  vertical-align: middle;
  height: 24px;
}
.select-type-btn span {
  margin-left: 24px;
  margin-right: 12px;
}
</style>
