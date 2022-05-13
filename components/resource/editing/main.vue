<template>
  <div class="page-container">
    <div>
      <div
        v-if="
          resourceStore.isMenuActive('informations') &&
          resourceStore.isSubMenuActive('general')
        "
      >
        <ResourceEditingGeneralInfo />
      </div>
      <div v-else-if="resourceStore.isMenuActive('informations')">
        <ResourceEditingCategories />
      </div>
      <ResourceEditingContents
        v-else-if="resourceStore.isMenuActive('contents')"
      />
    </div>

    <!-- navigation buttons at the bottom of the page -->
    <div class="navigation-buttons-holder">
      <div>
        <DsfrButton
          v-if="!resourceStore.isNavigationPreviousDisabled"
          icon="ri-arrow-left-s-line"
          label="Précédent"
          class="fr-btn--secondary btn--no-border"
          @click="resourceStore.navigationPrevious"
        />
      </div>
      <div>
        <DsfrButton
          v-if="!resourceStore.isNavigationNextDisabled"
          icon="ri-arrow-right-s-line"
          label="Suivant"
          icon-right
          class="fr-btn--secondary btn--no-border"
          @click="resourceStore.navigationNext"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"
import { DsfrButton } from "@laruiss/vue-dsfr"

const resourceStore = useResourceStore()
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
}
.navigation-buttons-holder {
  display: flex;
  justify-content: space-between;
}
</style>
