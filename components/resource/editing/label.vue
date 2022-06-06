<template>
  <div>
    <div>
      <a
        href="https://numerique-en-communs.fr/a-propos-de-nec/"
        target="_blank"
        class="no-underline"
      >
        <DsfrButton
          class="fr-btn--tertiary-no-outline"
          label="En savoir plus"
          :icon-right="true"
          icon="ri-arrow-right-line"
        />
      </a>
    </div>
    <div>
      <a :href="mailto" class="no-underline">
        <DsfrButton
          class="fr-btn--tertiary-no-outline"
          label="Faire une demande de Label Nec"
          :icon-right="true"
          icon="ri-mail-send-line"
        />
      </a>
    </div>
    <h3 class="fr-mt-2w">Statut</h3>
    <div>
      <DsfrBadge v-if="badge" :label="badge.label" :type="badge.type" />
      <p
        v-if="resourceStore.current.labelDetails"
        style="white-space: pre-line"
        class="fr-mt-2w"
      >
        {{ resourceStore.current.labelDetails }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DsfrButton } from "@laruiss/vue-dsfr"
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()

const badge = computed(() => {
  if (!resourceStore.current?.labelState) {
    return { label: "Non demandé", type: "" }
  }
  if (resourceStore.current?.labelState === "pending") {
    return { label: "Demande en cours de traitement", type: "new" }
  }
  if (resourceStore.current?.labelState === "refused") {
    return { label: "Demande refusée", type: "warning" }
  }
  if (resourceStore.current?.labelState === "accepted") {
    return { label: "Demande acceptée", type: "success" }
  }

  return null
})
const mailto = computed(() => {
  let toReturn =
    "mailto:demande-label-nec@anct.gouv.fr?subject=Demande de label NEC pour ma ressource"
  if (resourceStore.current?.title) {
    toReturn += ` "${resourceStore.current.title}" (id ${resourceStore.current.id})`
  }
  return toReturn
})
</script>
