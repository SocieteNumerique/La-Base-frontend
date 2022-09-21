<template>
  <div class="miniature-container fr-text--xs">
    <div class="fr-grid-row fr-grid-row--right fr-p-2w toolbar">
      <ShareButton :link="link" class="fr-mr-3w" />
    </div>
    <NuxtLink :to="link" class="no-underline link-container">
      <div v-if="base.profileImage" class="banner fr-p-1w">
        <ImageResized
          :resizable-image="base.profileImage"
          width="medium"
          circle
        />
      </div>
      <div class="fr-p-2w">
        <h3 class="fr-h6 fr-mb-0">
          {{ base.title }}
          <VIcon
            v-if="base.isCertified"
            name="official-line"
            :scale="0.9"
            style="position: relative; bottom: 2px"
          />
        </h3>
        <div class="separator fr-my-1w" />
        <div v-if="base.visitCount != null">
          <p class="fr-m-0">
            <span
              class="fr-text--xl fr-text--bold"
              title="depuis le 9 septembre"
              >{{ base.visitCount }}
            </span>
            {{ pluralize(["vue"], base.visitCount) }}
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
        <div v-if="territory.length" class="territory">
          <VIcon
            class="fr-mr-2v fr-text-title--blue-france"
            name="ri-map-pin-line"
          />
          {{ territory }}
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

const tagStore = useTagStore()

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
    height: 116px
    background-color: var(--background-default-grey-active)

  .link-container
    display: flex
    flex-direction: column

  .toolbar
    border-bottom: 1px solid var(--grey-975-75-active)
</style>
