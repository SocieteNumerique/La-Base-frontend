<template>
  <div class="fr-pr-2w">
    <div
      v-if="
        false && resourceStore.isCreating && resourceStore.creationStepIndex < 2
      "
    >
      <h2 class="fr-h4 fr-text-title--blue-france">Initialisation</h2>
      <div class="fr-text--xs">
        Nous avons besoin de quelques informations essentielles pour créer la
        ressource.
      </div>
    </div>
    <div v-else>
      <div class="fr-pb-3w" style="display: flex; flex-direction: column">
        <DsfrButton
          :secondary="true"
          label="Prévisualiser"
          icon="ri-eye-line"
          class="fr-btn--no-border .fr-btn--no-y-padding"
        />
        <DsfrButton
          :secondary="true"
          label="Copier l'url de la fiche"
          icon="ri-link"
          class="fr-btn--no-border .fr-btn--no-y-padding"
        />
        <DsfrButton
          :secondary="true"
          label="Supprimer"
          icon="ri-delete-bin-line"
          class="fr-btn--no-border .fr-btn--no-y-padding"
        />
      </div>
      <ResourceEditingMenuSeparator />
      <h2
        class="fr-text--lg cursor--pointer fr-text-title--blue-france fr-mb-1w fr-mt-2w"
        :class="boldIfMenuActive('informations')"
        @click="selectMenu('informations')"
      >
        Informations
      </h2>
      <div style=" flex; flex-direction: column">
        <DsfrButton
          v-for="subMenu in infoSubMenus"
          :key="subMenu"
          :secondary="true"
          :icon="iconIfSubMenuActive(subMenu)"
          class="fr-btn--no-border"
          :class="boldIfSubMenuActive(subMenu)"
          :label="displayInforSubMenu[subMenu]"
          :style="styleIfSubMenuActive(subMenu)"
          @click="selectSubMenu(subMenu)"
        />
      </div>
      <ResourceEditingMenuSeparator />
      <h2
        class="fr-text--lg cursor--pointer fr-text-title--blue-france fr-mb-1w"
        :class="boldIfMenuActive('contents')"
        @click="selectMenu('contents')"
      >
        Contenus (2)
      </h2>
      <ResourceEditingMenuSeparator />
      <h2
        class="fr-text--lg cursor--pointer fr-text-title--blue-france fr-mb-1w"
        :class="boldIfMenuActive('labels')"
        @click="selectMenu('labels')"
      >
        Labels
      </h2>
      <ResourceEditingMenuSeparator />
      <h2
        class="fr-text--lg cursor--pointer fr-text-title--blue-france fr-mb-1w"
        :class="boldIfMenuActive('interactions')"
        @click="selectMenu('interactions')"
      >
        Interactions
      </h2>
      <ResourceEditingMenuSeparator />
      <h2
        class="fr-text--lg cursor--pointer fr-text-title--blue-france fr-mb-1w"
        :class="boldIfMenuActive('save')"
        @click="selectMenu('save')"
      >
        Enregistrer
      </h2>
      <ResourceEditingMenuSeparator />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { computed } from "vue"

const infoSubMenus = [
  "general",
  "indexation",
  "credits",
  "territory",
  "license",
]
const displayInforSubMenu = {
  general: "Géneral",
  indexation: "Indexation",
  credits: "Crédits",
  territory: "Territoire",
  license: "Licence",
}

const resourceStore = useResourceStore()

const boldIfMenuActive = computed(() => (menuName: string) => {
  return resourceStore.isMenuActive(menuName)
    ? "fr-text--bold"
    : "fr-text--regular"
})
const boldIfSubMenuActive = computed(() => (menuName: string) => {
  return resourceStore.isSubMenuActive(menuName)
    ? "fr-text--bold"
    : "fr-text--regular"
})
const styleIfSubMenuActive = computed(() => (menuName: string) => {
  return resourceStore.isSubMenuActive(menuName) ? "" : "padding-left: 52px"
})
const iconIfSubMenuActive = computed(() => (menuName: string) => {
  return resourceStore.isSubMenuActive(menuName) ? "ri-arrow-right-line" : ""
})
const selectSubMenu = (subMenu: string) => {
  resourceStore.navigation.activeSubMenu = subMenu
}
const selectMenu = (menu: string) => {
  resourceStore.navigation.activeMenu = menu
}
</script>

<style lang="sass"></style>
