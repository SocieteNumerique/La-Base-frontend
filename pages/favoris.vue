<template>
  <div>
    <div class="fr-mb-4w fr-container fr-p-0">
      <h1 class="fr-h2">Mes bases favorites</h1>

      <div v-if="baseStore.bookmarks.length" class="bases-holder">
        <BaseMiniature
          v-for="base of baseStore.bookmarks"
          :key="base.id"
          :base="base"
        />
      </div>
      <div v-else>
        Vous n'avez aucune base en favori.
        <div class="fr-mt-2w">
          <NuxtLink to="/recherche?dataType=bases" class="no-underline">
            <DsfrButton
              label="Rechercher des bases"
              class="fr-btn--secondary"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBaseStore } from "~/stores/baseStore"
import { DsfrButton } from "@gouvminint/vue-dsfr"

const baseStore = useBaseStore()
</script>
