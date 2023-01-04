<template>
  <div class="miniature-container fr-text--xs">
    <div
      class="fr-grid-row fr-p-2w toolbar"
      style="display: flex; justify-content: space-between"
    >
      <ShareButton :link="link" />
      <BaseBookmarkButton :base-id="base.id" />
    </div>
    <NuxtLink :to="link" class="no-underline link-container">
      <div class="banner">
        <ImageResized
          :resizable-image="base.profileImage"
          format="miniature"
          circle
          default-image="base"
          class="profile"
        />
        <ImageResized
          :resizable-image="base?.coverImage"
          class="cover"
          :dimensions="{ width: '100%', height: '80px' }"
          format="miniature"
          overlay
        />
      </div>
      <div class="fr-p-2w">
        <h3 class="fr-h6 fr-mb-0">
          {{ base.title }}
          <VIcon
            v-if="base.isCertified"
            title="Cette base est certifiée"
            aria-label="Cette base est certifiée"
            name="official-line-colored"
            :scale="0.8"
            style="position: relative; bottom: 2px"
          />
        </h3>
        <div class="separator fr-my-1w" />
        <div class="stats-holder">
          <p
            v-if="base.stats.visitCount != null"
            title="nombre de vues depuis le 9 septembre 2022"
          >
            <span class="fr-text--lg fr-text--bold">{{
              base.stats.visitCount
            }}</span
            >{{ pluralize(["vue"], base.stats.visitCount) }}
          </p>
          <p v-if="base.stats.resourceCount != null">
            <span class="fr-text--lg fr-text--bold">{{
              base.stats.resourceCount
            }}</span
            >{{ pluralize(["ressource"], base.stats.resourceCount) }}
          </p>
          <p v-if="base.stats.bookmarkedCount != null">
            <span class="fr-text--lg fr-text--bold"
              >{{ base.stats.bookmarkedCount }}x</span
            >{{ pluralize(["favori"], base.stats.bookmarkedCount) }}
          </p>
        </div>
        <div
          v-if="participantTypes.length || territory.length"
          class="separator fr-my-1w"
        />
        <DsfrTags
          v-if="participantTypes.length"
          :tags="participantTypes"
          class="fr-mr-3w participant-tags"
        />
        <div v-if="territory.length" class="is-flex">
          <VIcon class="fr-mr-2v" name="ri-map-pin-line" />
          <div>{{ territory }}</div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue"
import { Base } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { pluralize } from "~/composables/strUtils"
import { useBaseStore } from "~/stores/baseStore"
import { useUserStore } from "~/stores/userStore"

const tagStore = useTagStore()
const baseStore = useBaseStore()
const userStore = useUserStore()

const props = defineProps({
  base: { type: Object as PropType<Base>, required: true },
})

const link = computed(() => `/base/${props.base.id}`)
const participantTypes = computed<{ label: string }[]>(
  () =>
    props.base?.participantTypeTags?.map((tagId: number) => {
      return { label: tagStore.tagsById[tagId]?.name, small: true }
    }) || []
)
const territory = computed<string>(() =>
  (
    props.base?.territoryTags?.map((id) => tagStore.tagsById[id].name) || []
  ).join(", ")
)
</script>

<style lang="sass" scoped>
.miniature-container
  width: 384px

  .banner
    height: 123px
    position: relative
    .profile
      position: absolute
      top: 37px
      left: 16px
      z-index: 10
    .cover
      height: 80px

  .link-container
    display: flex
    flex-direction: column

  .toolbar
    border-bottom: 1px solid var(--grey-975-75-active)
</style>
