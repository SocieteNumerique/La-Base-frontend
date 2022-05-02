<template>
  <div class="fr-card fr-enlarge-link" style="max-width: 200px">
    <NuxtLink :to="link">
      <div class="fr-card__body">
        <h4 class="fr-card__title">
          <p class="fr-card__link">{{ props.resource.title }}</p>
        </h4>
        <p class="fr-card__desc">Plus d'infos !!</p>
        <p class="fr-card__detail">{{ detail }}</p>
        <svg
          aria-hidden="true"
          class="ov-icon fr-card__arrow"
          data-v-2ca761af
          fill="currentColor"
          height="19.2"
          style="font-size: 1.2em"
          viewBox="0 0 24 24"
          width="19.2"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
          />
        </svg>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Resource } from "../composables/types"

const props = defineProps({
  resource: { type: Object as PropType<Resource>, required: true },
})

const detail = computed(() => props.resource.author.email)
const link = computed(() => `/resource/${props.resource.id}`)
</script>
