<template>
  <NuxtLayout name="default">
    <template #header>
      <h1>
        <template
          v-if="resourceStore.isCreating && resourceStore.creationStepIndex < 2"
        >
          Nouvelle fiche ressource
        </template>
        <template v-else-if="resourceStore.isCreating">
          {{ resourceStore.newParams.title }}
        </template>
        <template v-else>
          {{ resourceStore.current.title }}
        </template>
      </h1>
      <div class="fr-mb-14w" />
    </template>

    <div class="fr-col-3 fr-pr-3w">
      <ResourceEditingLeftMenu />
    </div>

    <div class="fr-col-6 fr-pr-3w">
      <slot />
    </div>

    <div class="fr-col-3">
      <ResourceDuplicatesStatus />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()
</script>
