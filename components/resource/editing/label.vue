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
    <h2 class="fr-mt-2w fr-h6">Statut</h2>
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
    return { label: "Non demandé ou demande non encore traitée", type: "" }
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
</script>
