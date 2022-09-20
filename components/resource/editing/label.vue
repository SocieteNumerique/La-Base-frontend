<template>
  <div>
    <div>
      <nuxt-link
        to="/label"
        target="_blank"
        class="no-underline no-append-ico fr-link fr-fi-arrow-right-line fr-link--icon-right"
      >
        En savoir plus
      </nuxt-link>
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
