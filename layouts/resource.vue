<template>
  <NuxtLayout name="default">
    <template #header>
      <div class="fr-grid-row">
        <div class="fr-col-3 fr-pr-3w fr-text--xs">
          <div>Statut : brouillon</div>
          <template v-if="resourceStore.current">
            <div>Signalements : 0</div>
            <div>Créée le : {{ $date(resourceStore.current.created) }}</div>
            <div>Modifiée le : {{ $date(resourceStore.current.modified) }}</div>
          </template>
        </div>
        <div class="fr-col-9 fr-pr-3w" style="min-height: 140px">
          <h1>
            <template
              v-if="
                resourceStore.isCreating && resourceStore.creationStepIndex < 2
              "
            >
              Nouvelle fiche ressource
            </template>
            <template v-else-if="resourceStore.isCreating">
              {{ resourceStore.newParams.title }}
            </template>
            <template v-else>
              <template v-if="resourceStore.current?.title">
                {{ resourceStore.current?.title }}
              </template>
            </template>
          </h1>
        </div>
      </div>
    </template>

    <div class="fr-col-3 fr-pr-3w">
      <ResourceEditingLeftMenu />
    </div>

    <div class="fr-col-6 fr-pr-3w">
      <slot />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"

const resourceStore = useResourceStore()
</script>
