<template>
  <NuxtLayout name="default">
    <template #header>
      <div style="background: #e8edff" class="fr-py-4w">
        <div class="fr-container">
          <IntroTooltip slug="INDEX_TITLE">
            <h1 class="fr-h1 fr-mb-0" style="max-width: 750px">
              Bienvenue sur La Base du numérique d’intérêt général
            </h1>
          </IntroTooltip>
        </div>
      </div>
    </template>
    <div>
      <div class="fr-container">
        <div
          class="fr-grid-row fr-mb-5w"
          style="justify-content: space-between"
        >
          <div class="fr-col-6" style="color: var(--text-action-high-grey)">
            <IntroTooltip slug="INDEX_FIRST_PARAGRAPH">
              <p>
                La Base regroupe les ressources des professionnels du numérique
                d’intérêt général dont l’inclusion et la médiation numériques.
              </p>
            </IntroTooltip>
            <p class="fr-mb-0">
              Vous pouvez naviguer au travers des bases des différents acteurs
              qui partagent leurs ressources et créer votre propre base.
            </p>
            <div>
              <NuxtLink
                to="/a-propos"
                class="no-underline no-append-ico fr-link fr-mt-2w"
              >
                <VIcon
                  name="ri-arrow-right-line"
                  class="fr-mr-1w"
                  scale="0.8 "
                />
                En savoir plus
              </NuxtLink>
            </div>
          </div>
          <div class="fr-col-5 fr-text-mention--grey">
            <div class="fr-mb-9v">
              <p class="fr-mb-3v">
                La Base est une plateforme en amélioration continue grâce à vos
                retours et contributions. Vous pouvez nous écrire pour nous
                transmettre vos idées et vos remarques quant à l’évolution de La
                Base.
              </p>
              <a href="mailto:labase@anct.gouv.fr" class="no-underline">
                <DsfrButton class="fr-btn--sm" label="Nous contacter" />
              </a>
            </div>

            <template v-if="!userStore.isLoggedIn">
              <p class="fr-mb-3v">
                Pour pouvoir créer une base, renseigner, publier et enregistrer
                des fiches ressources vous devez bénéficier d’un compte.
              </p>
              <div>
                <DsfrButton
                  class="fr-btn--sm"
                  label="S'inscrire"
                  @click="userStore.showSignUpModal = true"
                />
              </div>
            </template>
          </div>
        </div>
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
