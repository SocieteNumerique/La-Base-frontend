<template>
  <Html>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="description" />
    </Head>
  </Html>

  <NuxtLayout>
    <NuxtPage :key="$route.path" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useBaseStore } from "~/stores/baseStore"
import { useResourceStore } from "~/stores/resourceStore"
import { usePageStore } from "~/stores/pageStore"

useHead({
  titleTemplate: (title) => {
    if (title.length) {
      return `La Base - ${title}`
    }
    return "La Base"
  },
})

const route = useRoute()
const baseStore = useBaseStore()
const resourceStore = useResourceStore()
const pageStore = usePageStore()

const description = computed<string>(() => {
  if (route.path.startsWith("/base/") && baseStore.current?.description) {
    return baseStore.current.description
  }
  if (
    route.path.startsWith("/ressource/") &&
    resourceStore.current?.description
  ) {
    return resourceStore.current.description
  }
  return "La Base regroupe les ressources des professionnels du numérique d’intérêt général dont l’inclusion et la médiation numériques."
})

const title = computed<string>(() => {
  if (route.path.startsWith("/base/") && baseStore.current?.title) {
    return baseStore.current.title
  }
  if (route.path.startsWith("/ressource/") && resourceStore.current?.title) {
    return resourceStore.current.title
  }
  if (route.path.startsWith("/page/") && pageStore.current?.title) {
    return pageStore.current.title
  }
  return ""
})

// TODO: Remove :key="$route.path" when https://github.com/vuejs/core/issues/5513 fixed
// cf https://github.com/nuxt/framework/issues/3141#issuecomment-1219741638

// TODO might need to use :key="$route.fullpath", but that would break the
//  search by reloading everytime:/
</script>
