<template>
  <div class="fr-card fr-enlarge-link" style="max-width: 200px">
    <NuxtLink :to="link">
      <div class="fr-card__body">
        <h4 class="fr-card__title">
          <p class="fr-card__link">{{ props.base.title }}</p>
        </h4>

        <p class="fr-card__desc">Plus d'infos !!</p>
        <p class="fr-card__detail">{{ detail }}</p>
        <svg
          class="ov-icon fr-card__arrow"
          aria-hidden="true"
          width="19.2"
          height="19.2"
          viewBox="0 0 24 24"
          fill="currentColor"
          data-v-2ca761af
          style="font-size: 1.2em"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
          />
        </svg>
      </div>
    </NuxtLink>
    <DsfrInput :is-textarea="true" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Base } from "../composables/types"

const props = defineProps({
  base: { type: Object as PropType<Base>, required: true },
})

const detail = computed(() => props.base.owner.email)
const link = computed(() => `/base/${props.base.id}`)
</script>
