<template>
  <div id="editing-contents" class="page-container">
    <div>
      <div
        v-if="
          resourceStore.isMenuActive('informations') &&
          resourceStore.isSubMenuActive('general')
        "
      >
        <ResourceEditingGeneralInfo />
      </div>
      <ResourceEditingContents
        v-else-if="resourceStore.isMenuActive('contents')"
      />
      <div v-else>
        <ResourceEditingCategories />
      </div>
    </div>

    <!-- navigation buttons at the bottom of the page -->
    <div class="navigation-buttons-holder fr-mt-7w">
      <div>
        <DsfrButton
          v-if="!resourceStore.isNavigationPreviousDisabled"
          icon="ri-arrow-left-s-line"
          label="Précédent"
          class="fr-btn--secondary btn--no-border fr-pl-0"
          @click="resourceStore.navigationPrevious"
        />
      </div>
      <div>
        <DsfrButton
          v-if="!resourceStore.isNavigationNextDisabled"
          icon="ri-arrow-right-s-line"
          label="Suivant"
          icon-right
          class="fr-btn--secondary btn--no-border fr-pr-0"
          @click="resourceStore.navigationNext"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useResourceStore } from "~/stores/resourceStore"
import { DsfrButton } from "@gouvminint/vue-dsfr"

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
