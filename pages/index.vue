<template>
  <NuxtLayout name="default">
    <template #header>
      <div
        style="background: var(--background-alt-blue-france)"
        class="fr-py-8w"
      >
        <div class="fr-container">
          <IntroTooltip slug="INDEX_TITLE">
            <h1 class="fr-h1 fr-mb-7w" style="max-width: 750px">
              Bienvenue sur La Base
            </h1>
          </IntroTooltip>
          <div class="fr-grid-row" style="justify-content: space-between">
            <div class="fr-col-6" style="color: var(--text-action-high-grey)">
              <TextBlock slug="homeIntroLeft" />
            </div>
            <div class="fr-col-5 fr-text-mention--grey">
              <TextBlock slug="homeIntroRight" />
              <NuxtLink to="/a-propos" class="fr-btn fr-mt-2w">
                <VIcon
                  name="ri-arrow-right-line"
                  class="fr-mr-1w"
                  scale="0.8 "
                />
                En savoir plus
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div>
      <div class="fr-container fr-pt-5w">
        <h2 class="fr-mb-5w">Que trouve-t-on dans La Base ?</h2>
        <HomeBlock
          icon="/img/home/block-search.svg"
          title="Le moteur de recherche"
          description-slug="homeSearchBlockDescription"
          to="/recherche"
          text-slug="homeSearchBlockContent"
          more-text-slug="homeSearchBlockContentMore"
          class="fr-mb-5w"
        />
        <HomeBlock
          icon="/img/home/block-people.svg"
          title="Le compte"
          description-slug="homeAccountBlockDescription"
          to="/profil-informations"
          text-slug="homeAccountBlockContent"
          more-text-slug="homeAccountBlockContentMore"
          class="fr-mb-5w"
        />
        <HomeBlock
          icon="/img/home/block-resources.svg"
          title="Les fiches ressource"
          description-slug="homeResourcesBlockDescription"
          to="/recherche"
          text-slug="homeResourcesBlockContent"
          more-text-slug="homeResourcesBlockContentMore"
          class="fr-mb-5w"
        />
        <HomeBlock
          icon="/img/home/block-bases.svg"
          title="Le moteur de recherche"
          description-slug="homeBasesBlockDescription"
          to="/recherche"
          text-slug="homeBasesBlockContent"
          more-text-slug="homeBasesBlockContentMore"
          class="fr-mb-5w"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Base, GenericSearchResult, Resource } from "~/composables/types"
import { computed, onMounted } from "vue"
import { pluralize } from "~/composables/strUtils"
import { useRoute, useRouter } from "vue-router"
import { useAlertStore } from "~/stores/alertStore"
import { useUserStore } from "~/stores/userStore"
import { useLoadingStore } from "~/stores/loadingStore"
import { paginationFromNResults } from "~/composables/pagination"
import { useFullWidth } from "~/composables/useFullWidth"

definePageMeta({
  middleware: ["home"],
  layout: false,
  title: "Base",
})

const userStore = useUserStore()

useFullWidth()

onMounted(() => {
  // display email confirmation when appropriate
  const route = useRoute()
  if (route.query.emailConfirmed) {
    const alertStore = useAlertStore()
    alertStore.alert("Email confirmé")
  }
})
</script>

<style scoped lang="sass">
.toggleButton
  border-bottom: 2px solid var(--text-title-blue-france)

.dataTypeChooser
  display: flex
  cursor: pointer
  text-align: center
  border: 1px solid #CECECE
  &.selected
    background: var(--background-alt-blue-france)
    box-shadow: inset 0 0-2px 0 var(--border-action-high-blue-france)
    border: 1px solid transparent
  &:hover
    border-color: var(--text-title-blue-france)

.dataTypeIcon
  padding: 65px

.dataTypeContent
  padding-right: 65px
  text-align: left

.dropdown-holder
  display: flex
  margin-left: -32px
  flex-wrap: wrap
  margin-top: 16px
  *
    margin-left: 32px
    margin-top: 0
</style>

<style>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.small-radio-buttons .fr-fieldset__content {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
