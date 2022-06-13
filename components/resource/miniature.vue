<template>
  <div class="resource-miniature-container fr-text--xs">
    <div class="fr-grid-row fr-grid-row--right fr-p-2w">
      <RoundButton icon="ri-share-line" />
      <PinMenu
        v-model="basesPinnedIn"
        :instance-id="resource?.id"
        :root-base-id="resource?.rootBase"
        instance-type="resource"
      />
    </div>
    <NuxtLink :to="`/ressource/${resource.id}/edition`" class="no-underline">
      <div
        :class="resource.isLabeled ? 'green-bg' : 'grey-bg'"
        class="bordered fr-p-2w"
      >
        <h3 class="fr-h6">{{ resource.title }}</h3>
        <div class="separator fr-mx-4w fr-my-1w" />
        <div>
          Fiche publiée par
          <div>{{ resource?.rootBaseTitle }}</div>
        </div>
        <div class="separator fr-mx-4w fr-my-1w" />
        <div v-if="resource.stats">stats</div>
      </div>
      <div class="fr-p-2w">
        <div>
          <h4 class="fr-text--md">Description</h4>
          <div class="description-text">{{ resource?.description }}</div>
        </div>
        <div class="separator fr-mx-2w fr-my-3v" />
        <div>
          <h4 class="fr-text--md">Type de support</h4>
          <DsfrTags :tags="supportTags" />
        </div>
        <div class="separator fr-mx-2w fr-my-3v" />
        <div class="fr-grid-row fr-text-mention--grey">
          <div class="fr-mr-2w">
            <VIcon :scale="0.7" class="fr-mr-2v" name="ri-link" />
            {{ resource?.contentStats?.links }}
            {{ pluralize(["lien", "liens"], resource?.contentStats?.links) }}
          </div>
          <div>
            <VIcon :scale="0.7" class="fr-mr-2v" name="ri-file-line" />
            {{ resource?.contentStats?.files }}
            {{
              pluralize(["fichier", "fichiers"], resource?.contentStats?.files)
            }}
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

const props = defineProps({
  resource: { type: Object as PropType<Resource>, required: true },
  modelValue: { type: Array as PropType<PinStatus[]>, required: true },
})

const basesPinnedIn = useModel("modelValue", { type: "array" })

const supportTags = computed<{ label: string }[]>(
  () =>
    props.resource.supports?.map((label: string) => {
      return { label }
    }) || []
)
</script>

<style lang="sass" scoped>
.resource-miniature-container
  border: 1px solid var(--grey-975-75-active)
  display: block
  background: none

  > *
    padding: 16px

  .description-text
    max-height: 80px
    overflow: hidden
    text-overflow: ellipsis


.green-bg
  background-color: var(--green-emeraude-975-75)

.grey-bg
  background-color: var(--background-alt-grey)

.bordered
  border-top: 1px solid var(--grey-975-75-active)
  border-bottom: 1px solid var(--grey-975-75-active)
  color: var(--text-action-high-grey)

.separator
  border-top: 1px solid var(--grey-975-75-active)
</style>
