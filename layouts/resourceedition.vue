<template>
  <NuxtLayout name="default">
    <template #header>
      <div class="fr-container fr-mt-2w">
        <div class="fr-grid-row">
          <div class="fr-col-3"></div>
          <div class="fr-col-6">
            <div v-if="resourceStore.currentId">
              <NuxtLink :to="baseHref" class="no-underline">
                <DsfrButton
                  icon="ri-arrow-go-back-line"
                  class="fr-btn--tertiary-no-outline fr-pl-0 fr-btn--sm"
                  label="Retour à la base"
                />
              </NuxtLink>
              <NuxtLink :to="resourceHref" class="no-underline">
                <DsfrButton
                  icon="ri-file-line"
                  class="fr-btn--tertiary-no-outline fr-ml-2w fr-btn--sm"
                  label="Aller à la fiche"
                />
              </NuxtLink>
            </div>
          </div>
        </div>

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
import { DsfrButton } from "@gouvminint/vue-dsfr"

const resourceStore = useResourceStore()

const goToState = () => {
  console.log("### go to state")
  resourceStore.navigation.activeMenu = "parameters"
  resourceStore.navigation.activeSubMenu = "state"
}

const stateLabel = {
  public: "Public",
  private: "Privé",
  draft: "Brouillon",
  restricted: "Restreint",
}

const baseHref = computed(() => {
  return "/base/" + resourceStore.current?.rootBase
})
const resourceHref = computed(() => "/ressource/" + resourceStore.currentId)
</script>
