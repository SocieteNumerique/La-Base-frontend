<template>
  <div class="miniature-container fr-text--xs">
    <div v-if="props.showToolbar" class="fr-grid-row fr-p-2w toolbar">
      <PinMenu
        v-model="pinnedInBases"
        :instance-id="resource?.id"
        :root-base-id="resource?.rootBase"
        instance-type="resource"
        :small="true"
      />
      <div class="is-flex fr-ml-auto" style="align-items: center">
        <ShareButton
          :link="link"
          :class="userStore.isLoggedIn ? 'fr-mr-3w' : ''"
        />
        <NuxtLink
          v-if="resource?.canWrite"
          :to="`/ressource/${resource.id}/edition`"
          class="no-underline no-append-ico fr-px-1w fr-btn fr-btn--secondary btn--no-border fr-btn--sm fr-py-0 round-button"
          :target="targetLink"
          title="Éditer la fiche"
          aria-label="Éditer la fiche"
        >
          <VIcon
            style="color: var(--text-action-high-blue-france)"
            scale="0.9"
            name="ri-edit-line"
          />
        </NuxtLink>
      </div>
    </div>
    <NuxtLink
      :to="`/ressource/${resource?.id}`"
      class="no-underline no-append-ico"
      :target="targetLink"
      style="outline-style: revert"
    >
      <div
        :class="resource?.isLabeled ? 'green-bg' : 'grey-bg'"
        class="bordered fr-p-2w"
      >
        <ImageResized
          class="fr-mb-2w"
          :resizable-image="resource?.profileImage"
          :dimensions="{ width: '100%', height: '252px' }"
          format="miniature"
          default-image="resource"
        />
        <h3 class="fr-h6 fr-mb-0">{{ resource?.title }}</h3>
        <div class="separator fr-my-1w" />
        <div class="credits-grid">
          <div>Publiée dans</div>
          <div>
            <NuxtLink :to="`/base/${resource?.rootBase}`" class="blue-link">
              {{ resource?.rootBaseTitle }}
            </NuxtLink>
          </div>
          <template
            v-if="
              resource?.canWrite &&
              (resource?.creator?.firstName || resource?.creator?.lastName)
            "
          >
            <div>Créée par</div>
            <div>
              {{ resource?.creator?.firstName }}
              {{ resource?.creator?.lastName }}
            </div>
          </template>
        </div>
        <div class="separator fr-my-1w" />
        <div
          v-if="resource.stats"
          class="stats-holder"
          :class="resource?.profileImage ? 'fr-mt-1w' : ''"
        >
          <p title="nombre de vues depuis le 9 septembre 2022" class="fr-mb-0">
            <span class="fr-text--lg fr-text--bold">
              {{ resource?.stats.visitCount }}</span
            >{{ pluralize(["vue"], resource?.stats.visitCount) }}
          </p>
          <p class="fr-mb-0">
            <span class="fr-text--lg fr-text--bold">
              {{ resource?.stats.pinCount }}</span
            >{{ pluralize(["enregistrement"], resource?.stats.pinCount) }}
          </p>
        </div>
        <template
          v-if="resource?.stats.recommendationCount && resource?.canEvaluate"
        >
          <div class="separator fr-my-1w" />
          <div class="fr-pt-1v">
            <DsfrBadge
              :type="recoBadge.type"
              :label="recoBadge.label"
              :no-icon="true"
              :small="true"
              class="fr-mr-3v"
            />
            <span>
              {{ recoBadge.pct }}% sur
              {{ resource?.stats.recommendationCount }} évaluations
            </span>
          </div>
        </template>
      </div>

      <div class="fr-p-2w">
        <template v-if="resource?.description">
          <div class="description-text">{{ resource?.description }}</div>
          <div class="separator fr-my-3v" />
        </template>
        <div v-if="supportTags.length">
          <h4
            class="fr-text--xs fr-mr-3v"
            :class="supportTags.length ? 'fr-mb-3v' : 'fr-mb-0'"
            style="display: inline"
          >
            Type de support
          </h4>
          <DsfrTags
            :tags="supportTags"
            style="margin-bottom: -8px; display: inline"
          />
          <div class="separator fr-mb-3v fr-mt-1v" />
        </div>
        <div class="fr-grid-row fr-text-mention--grey">
          <div class="fr-mr-5v">
            <VIcon :scale="0.7" class="fr-mr-1v" name="ri-link" />
            {{ resource?.contentStats?.links }}
            {{ pluralize(["lien"], resource?.contentStats?.links) }}
          </div>
          <div>
            <VIcon :scale="0.7" class="fr-mr-1v" name="ri-file-line" />
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
import { useUserStore } from "~/stores/userStore"
import { DsfrBadge } from "@gouvminint/vue-dsfr"

const props = defineProps({
  showToolbar: { type: Boolean, default: true },
  resource: { type: Object as PropType<Resource>, required: true },
  modelValue: { type: Array as PropType<PinStatus[]>, required: true },
  newTab: { type: Boolean, default: false },
})

const userStore = useUserStore()
const pinnedInBases = useModel("modelValue", { type: "array" })
const tagStore = useTagStore()

const targetLink = computed<string>(() => {
  return props.newTab ? "_blank" : "_self"
})

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
const recoBadge = computed<{ label: string; type: string }>(() => {
  const mean =
    props.resource?.stats?.recommendationMean == null
      ? 1
      : props.resource?.stats?.recommendationMean
  return recommendationBadge(mean * 100)
})
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
