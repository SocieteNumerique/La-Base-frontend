<template>
  <NuxtLayout name="default">
    <template #header>
      <div class="fr-container fr-mt-2w fr-px-0">
        <div class="fr-grid-row fr-mt-2w">
          <div class="fr-col-3 fr-pr-3w fr-text--xs">
            <div
              class="cursor--pointer fr-text-label--blue-france"
              @click="goToState"
            >
              Statut : {{ stateLabel[resourceStore.current?.state] }}
            </div>
            <template v-if="resourceStore.current">
              <div>Créée le : {{ $date(resourceStore.current.created) }}</div>
              <div>
                Modifiée le : {{ $date(resourceStore.current.modified) }}
              </div>
              <div
                v-if="
                  resourceStore.current.canWrite &&
                  (resourceStore.current.creator?.firstName ||
                    resourceStore.current.creator?.lastName)
                "
              >
                Créée par {{ resourceStore.current.creator?.firstName }}
                {{ resourceStore.current.creator?.lastName }}
              </div>
            </template>
          </div>
          <div class="fr-col-6 fr-pr-3w">
            <h1 class="fr-h2">
              <template
                v-if="
                  resourceStore.isCreating &&
                  resourceStore.creationStepIndex < 2
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
      </div>
    </template>

    <div class="fr-container fr-px-0">
      <div class="fr-mb-11v">
        <div class="fr-grid-row">
          <div class="fr-col-3 fr-pr-3w">
            <ResourceEditingLeftMenu />
          </div>

          <div class="fr-col-6 fr-pr-3w">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { DsfrButton, DsfrModal } from "@gouvminint/vue-dsfr"
import { useRouter } from "vue-router"
import { computed } from "vue"

const resourceStore = useResourceStore()

const goToState = () => {
  resourceStore.navigation.activeMenu = "parameters"
  resourceStore.navigation.activeSubMenu = "state"
}

const stateLabel = {
  public: "Public",
  private: "Privé",
  draft: "Brouillon",
  restricted: "Restreint",
}
</script>
