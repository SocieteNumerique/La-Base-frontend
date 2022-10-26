<template>
  <div>
    <div v-if="content.withPreview && content.targetTitle" class="link-preview">
      <div v-if="content.targetImage" style="display: flex">
        <div class="fr-p-1w">
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
          class="fr-ml-1v"
          :style="`background-image: url('${content.targetImage}')`"
          style="
            flex: 0 0 180px;
            background-size: cover;
            background-position: center;
          "
        ></div>
      </div>
      <template v-else>
        <p class="fr-text--bold">{{ content.targetTitle }}</p>
        <p>{{ content.targetDescription }}</p>
      </template>
    </div>
    <VIcon class="fr-mr-1w" name="ri-link" />
    <a
      :href="content.link"
      class="no-underline no-append-ico fr-text-title--blue-france"
      rel="noopener noreferrer"
      target="_blank"
    >
      {{ content.link }}
    </a>
    <!-- TODO only host -->
  </div>
</template>

<script lang="ts" setup>
import { LinkContent } from "~/composables/types"
import { PropType } from "vue"

defineProps({
  content: { type: Object as PropType<LinkContent>, required: true },
})

const limitedDescription = (description: string) => {
  if (description.length < 150) {
    return description
  }
  return description.substring(0, 150) + "..."
}
</script>

<style lang="sass" scoped>
.link-preview
  border: 1px solid var(--border-default-grey)
</style>
