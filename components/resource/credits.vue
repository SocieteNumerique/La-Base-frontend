<template>
  <div>
    <h2 class="fr-text--bold fr-mb-2w fr-text--md">Crédits de la ressource</h2>
    <div>
      <p
        v-for="producer in producers"
        :key="producer.name"
        class="fr-text--sm fr-mb-3v"
      >
        <template v-if="producer.href">
          <template v-if="producer.isExternalLink">
            <a
              :href="producer.href"
              class="fr-text-label--blue-france no-underline underlined-on-hover"
              target="_blank"
              rel="noopener noreferrer"
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
        <template v-else>
          {{ producer.name }}
        </template>
        <DsfrTag
          v-if="producer.tag"
          :label="producer.tag.name"
          small
          class="fr-ml-2w"
        />
      </p>
    </div>
    <div>
      <DsfrButton
        label="Demander à être crédité"
        icon="ri-arrow-right-line"
        icon-right
        class="fr-btn--tertiary-no-outline fr-btn--sm fr-pl-0"
        @click="showCreditsModal = true"
      />
    </div>
    <DsfrModal
      v-if="showCreditsModal"
      :actions="[
        {
          label: 'Envoyer',
          onClick: sendCreditsRequest,
          disabled: creditsRequestMessage.length < 10,
        },
        {
          label: 'Annuler',
          onclick: () => (showCreditsModal = false),
          secondary: true,
        },
      ]"
      :opened="true"
      title="Demander à être crédité"
      @close="showCreditsModal = false"
    >
      <p>
        Si vous voulez être crédité comme producteur de la ressource, vous
        pouvez envoyer une demande de crédit via cette fenêtre.
      </p>
      <DsfrInput
        v-model="creditsRequestMessage"
        :is-textarea="true"
        :label-visible="true"
        label="Votre demande"
        hint="Merci de précisez votre demande au propriétaire de la fiche"
      >
      </DsfrInput>
    </DsfrModal>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useResourceStore } from "~/stores/resourceStore"
import { useBaseStore } from "~/stores/baseStore"
import { Tag } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { DsfrInput } from "@gouvminint/vue-dsfr"
import { useUserStore } from "~/stores/userStore"
import { useAlertStore } from "~/stores/alertStore"
import { useApiPost } from "~/composables/api"

type Producer = {
  isExternalLink?: boolean
  name: string
  href?: string
  tag?: Tag
}

const showCreditsModal = ref(false)
const resourceStore = useResourceStore()
const baseStore = useBaseStore()
const tagStore = useTagStore()
const userStore = useUserStore()
const alertStore = useAlertStore()
const creditsRequestMessage = ref("")

const sendCreditsRequest = async () => {
  if (!userStore.isLoggedIn) {
    alertStore.alert(
      "Vous devez être connecté pour demander à être crédité",
      "",
      "warning"
    )
  }
  const { error } = await useApiPost(
    "credits",
    { id: resource.value.id, message: creditsRequestMessage.value },
    {},
    "La demande de crédit a bien été envoyée",
    true
  )
  if (!error.value) {
    showCreditsModal.value = false
  }
}

const producers = computed<Producer[]>(() => {
  if (resource.value == null || resource.value.isShort) {
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
  }
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

  return toReturn
})

const resource = computed(() => {
  return resourceStore.current
})
</script>
