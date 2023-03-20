<template>
  <div>
    <a
      v-if="content.withPreview && content.targetTitle"
      :href="content.link"
      class="no-underline no-append-ico"
      rel="noopener noreferrer"
      target="_blank"
    >
      <div class="link-preview fr-mb-2w">
        <div style="display: flex">
          <div class="fr-p-1w" style="flex-grow: 1">
            <p class="fr-text--bold fr-text--xs fr-m-0">
              {{ content.targetTitle }}
            </p>
            <p
              v-if="content.targetDescription"
              class="fr-text--xs fr-mt-1v fr-mb-0"
            >
              {{ limitedDescription(content.targetDescription) }}
            </p>
          </div>
          <div
            v-if="content.targetImage"
            class="fr-ml-1v right-image proper-image"
            :style="`background-image: url('${content.targetImage}')`"
          ></div>
          <div v-else class="right-image default-image">
            <VIcon
              scale="1.3"
              name="ri-link"
              color="var(--text-action-high-blue-france)"
            />
          </div>
        </div>
      </div>
    </a>

    <VIcon class="fr-mr-1w" scale="0.8" name="ri-link" />
    <a
      :href="content.link"
      class="no-append-ico fr-text-title--blue-france fr-text--xs"
      rel="noopener noreferrer"
      target="_blank"
      style="word-break: break-all"
    >
      {{ content.link }}
    </a>
  </div>
</template>

<script lang="ts" setup>
import { LinkContent } from "~/composables/types"
import { PropType } from "vue"
import { limitedDescription } from "~/composables/utils"

defineProps({
  content: { type: Object as PropType<LinkContent>, required: true },
})
</script>

<style lang="sass" scoped>
.proper-image
  background-size: cover
  background-position: center
</style>
