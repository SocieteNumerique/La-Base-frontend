<template>
  <NuxtLayout name="default">
    <template #header>
      <div class="fr-container fr-mt-2w">
        <div class="fr-grid-row">
          <div class="fr-col-3"></div>
          <div class="fr-col-6">
            <div v-if="resourceStore.currentId">
              <DsfrButton
                icon="ri-arrow-go-back-line"
                class="fr-btn--tertiary-no-outline fr-pl-0 fr-btn--sm"
                label="Retour à la base"
                @click="goTo('base')"
              />
              <DsfrButton
                icon="ri-file-line"
                class="fr-btn--tertiary-no-outline fr-ml-2w fr-btn--sm"
                label="Aller à la fiche"
                @click="goTo('resource')"
              />
            </div>
          </div>
        </div>

        <div class="fr-grid-row fr-mt-2w">
          <div class="fr-col-3 fr-pr-3w fr-text--xs">
            <div
              class="cursor--pointer fr-text-label--blue-france underlined-on-hover"
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
    <DsfrModal
      v-if="isNavigating !== ''"
      :actions="goToActions"
      title="Modifications en cours"
      :opened="true"
      @close="isNavigating = ''"
    >
      <p>
        Vous avez des modifications en cours, voulez-vous les ignorer ou
        continuer l'édition ?
      </p>
    </DsfrModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { DsfrButton, DsfrModal } from "@gouvminint/vue-dsfr"
import { useRouter } from "vue-router"
import { computed } from "vue"

const router = useRouter()

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
const isNavigating = ref<"" | "resource" | "base">("")
const goTo = (target: "resource" | "base", check = true) => {
  console.log("### goto", target, check)
  if (check && resourceStore.current.dirty) {
    // show confirmation modal
    console.log("## show modal !")
    isNavigating.value = target
  } else {
    // navigate
    router.push(target == "resource" ? resourceHref.value : baseHref.value)
  }
}
const goToActions = computed(() => {
  const target = isNavigating.value === "resource" ? "resource" : "base"
  return [
    {
      label: "Continuer l'édition",
      onClick: () => {
        isNavigating.value = ""
      },
    },
    {
      label: "Aller à la " + (target === "resource" ? "ressource" : "base"),
      secondary: true,
      onClick: () => {
        goTo(target, false)
      },
    },
  ]
})
</script>
