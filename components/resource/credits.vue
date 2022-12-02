<template>
  <div v-if="producers.length">
    <p class="fr-text--bold fr-mb-0 fr-text--sm">Crédits de la ressource</p>
    <p
      v-for="producer in producers"
      :key="producer.name"
      class="fr-text--sm fr-m-0"
    >
      <template v-if="producer.href">
        <template v-if="producer.isExternalLink">
          <a
            :href="producer.href"
            class="fr-text-label--blue-france no-underline underlined-on-hover"
            target="_blank"
          >
            {{ producer.name }}
          </a>
        </template>
        <template v-else>
          <NuxtLink
            :to="producer.href"
            class="fr-text-label--blue-france no-underline underlined-on-hover"
            :title="producer.href"
          >
            {{ producer.name }}
          </NuxtLink>
        </template>
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useResourceStore } from "~/stores/resourceStore"
import { useBaseStore } from "~/stores/baseStore"
import { Tag } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"

type Producer = {
  isExternalLink?: boolean
  name: string
  href?: string
  tag?: Tag
}

const resourceStore = useResourceStore()
const baseStore = useBaseStore()
const tagStore = useTagStore()

const producers = computed<Producer[]>(() => {
  console.log("### producers", resource.value)
  if (resource.value.isShort) {
    return []
  }

  const toReturn: Producer[] = []
  if (resource.value.producerState == "me") {
    for (const baseId of resource.value.creatorBases || []) {
      const base = baseStore.basesById[baseId]
      if (base == null) {
        // base might not be accessible by current user
        continue
      }
      toReturn.push({
        isExternalLink: false,
        name: base.title,
        href: `/base/${baseId}`,
      })
    }
  } else if (resource.value.producerState == "know") {
    for (const externalProducer of resource.value.externalProducers!) {
      const producer: Producer = { name: externalProducer.name }
      if (externalProducer.websiteUrl) {
        producer.href = externalProducer.websiteUrl
        producer.isExternalLink = true
      } else if (externalProducer.emailContact) {
        producer.href = `mailto:${externalProducer.emailContact}`
      }
      if (externalProducer.occupation) {
        producer.tag = tagStore.tagsById[externalProducer.occupation]
      }
      toReturn.push(producer)
    }
  }

  console.log("### producers", toReturn)

  return toReturn
})

const resource = computed(() => {
  return resourceStore.current
})
</script>
