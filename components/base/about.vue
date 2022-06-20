<template>
  <div>
    <h3 class="fr-h6">Présentation de la base</h3>
    <article class="fr-grid-row">
      <div class="fr-col-4">
        <p>{{ base.description }}</p>
      </div>
      <div class="misc-base-data fr-col-2 fr-col-offset-1">
        <div>
          <div v-if="participantTypes" class="h7 fr-text--md fr-text--md">
            Type d'acteurs
          </div>
          <DsfrTags :tags="participantTypes" class="fr-mr-3w actor-tags" />
        </div>
        <div v-if="territory">
          <div class="h7 fr-text--md">Localisation</div>
          <p>{{ territory }}</p>
        </div>
        <div>
          <div v-if="base.contact" class="h7 fr-text--md">Contact</div>
          <p>{{ base.contact }}</p>
        </div>
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { Base } from "~/composables/types"
import { PropType } from "vue"

defineProps({
  base: { type: Object as PropType<Base>, required: true },
  territory: { type: String, default: "" },
  participantTypes: {
    type: Array as PropType<{ label: string }[]>,
    default: () => [],
  },
})
</script>

<style lang="sass" scoped>
.fr-h6, .h7
  color: black

.h7
  font-weight: 700
  margin-bottom: 8px

.misc-base-data > div
  margin-bottom: 32px
</style>
