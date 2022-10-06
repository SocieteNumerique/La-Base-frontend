<template>
  <div>
    <div v-if="page && !page.isShort">
      <div v-html="page?.htmlContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { useRoute } from "vue-router"
import { Page } from "~/composables/types"

const pageStore = usePageStore()
const route = useRoute()

const pageSlug: string = <string>route.params.slug
const page = computed<Page>(() => pageStore.pagesBySlug[pageSlug])

if (page.value == null || page.value?.isShort) {
  pageStore.getPage(pageSlug)
}
</script>
