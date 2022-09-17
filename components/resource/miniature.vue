<template>
  <div class="miniature-container fr-text--xs">
    <div class="fr-grid-row fr-p-2w toolbar">
      <nuxt-link
        v-if="resource.canWrite"
        :to="`/ressource/${resource.id}/edition`"
        class="no-underline"
      >
        <button class="fr-btn--tertiary-no-outline">
          <VIcon name="ri-edit-line" />
        </button>
      </nuxt-link>
      <div class="is-flex fr-ml-auto">
        <ShareButton :link="link" class="fr-mr-3w" />
        <PinMenu
          v-model="pinnedInBases"
          :instance-id="resource?.id"
          :root-base-id="resource?.rootBase"
          instance-type="resource"
          :small="true"
        />
      </div>
    </div>
    <NuxtLink :to="`/ressource/${resource.id}`" class="no-underline">
      <div
        :class="resource.isLabeled ? 'green-bg' : 'grey-bg'"
        class="bordered fr-p-2w"
      >
        <h3 class="fr-h6 fr-mb-0">{{ resource.title }}</h3>
        <div class="separator fr-my-1w" />
        <div class="credits-grid">
          <div>Publiée dans</div>
          <div>
            <nuxt-link :to="`/base/${resource?.rootBase}`" class="blue-link">
              {{ resource?.rootBaseTitle }}
            </nuxt-link>
          </div>
          <template
            v-if="
              resource?.canWrite &&
              (resource?.creator?.firstName || resource?.creator?.lastName)
            "
          >
            <div>Créée par</div>
            <div>
              {{ resource.creator.firstName }}
              {{ resource.creator.lastName }}
            </div>
          </template>
        </div>
        <!-- <div class="separator fr-my-1w" />
        <div v-if="resource.stats">stats</div>-->
      </div>
      <div class="fr-p-2w">
        <div>
          <h4 class="fr-text--xs fr-mb-3v">Description</h4>
          <div class="description-text">{{ resource?.description }}</div>
        </div>
        <div class="separator fr-my-3v" />
        <div>
          <h4 class="fr-text--xs fr-mb-3v">Type de support</h4>
          <DsfrTags :tags="supportTags" />
        </div>
        <div class="separator fr-my-3v" />
        <div class="fr-grid-row fr-text-mention--grey">
          <div class="fr-mr-2w">
            <VIcon :scale="0.7" class="fr-mr-2v" name="ri-link" />
            {{ resource?.contentStats?.links }}
            {{ pluralize(["lien"], resource?.contentStats?.links) }}
          </div>
          <div>
            <VIcon :scale="0.7" class="fr-mr-2v" name="ri-file-line" />
            {{ resource?.contentStats?.files }}
            {{ pluralize(["fichier"], resource?.contentStats?.files) }}
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { pluralize } from "~/composables/strUtils"
import { PinStatus, Resource } from "~/composables/types"
import { PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"

const props = defineProps({
  resource: { type: Object as PropType<Resource>, required: true },
  modelValue: { type: Array as PropType<PinStatus[]>, required: true },
})

const pinnedInBases = useModel("modelValue", { type: "array" })
const tagStore = useTagStore()

const supportTags = computed<{ label: string }[]>(
  () =>
    props.resource.supportTags?.map((id: number) => {
      return { label: tagStore.tagsById[id].name, small: true }
    }) || []
)

const link = computed(
  () =>
    useRouter().resolve({
      name: "ressource-id",
      params: { id: props.resource.id },
    }).href
)
</script>

<style lang="sass" scoped>
.miniature-container
  .toolbar
    align-items: center

  .description-text
    overflow: hidden
    display: -webkit-box
    -webkit-line-clamp: 4
    -webkit-box-orient: vertical


.green-bg
  background-color: var(--green-emeraude-975-75)

.grey-bg
  background-color: var(--background-alt-grey)

.bordered
  border-top: 1px solid var(--grey-975-75-active)
  border-bottom: 1px solid var(--grey-975-75-active)
  color: var(--text-action-high-grey)

.credits-grid
  display: grid
  grid-template-columns: 4.6rem auto
  grid-column-gap: 0.75rem

  a.blue-link
    color: var(--text-action-high-blue-france)
    background: none
</style>
