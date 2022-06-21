<template>
  <header class="fr-header" role="banner">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <NuxtLink to="/"><DsfrLogo :logo-text="logoTitle" /></NuxtLink>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-links-group">
                <li v-if="userStore.isLoggedIn" class="selector">
                  <template v-if="baseStore.hasBases">
                    <button
                      :class="{ '-active': showBasesList }"
                      class="fr-link btn-tab-activable"
                      @click="showBasesList = !showBasesList"
                    >
                      Mes bases
                    </button>
                    <div
                      v-show="showBasesList"
                      id="header-bases-list"
                      class="selector__menu fr-px-2w fr-text--xs"
                    >
                      <NuxtLink
                        v-for="{ value: id, text } of baseStore.baseOptions"
                        :key="id"
                        :to="`/base/${id}`"
                        class="item"
                      >
                        {{ text }}
                      </NuxtLink>
                      <div
                        class="item fr-text-title--blue-france"
                        @click="showAddBaseModal = true"
                      >
                        Créer une base
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <button class="fr-link" @click="showAddBaseModal = true">
                      Créer une base
                    </button>
                  </template>
                </li>
                <li v-if="!userStore.isLoggedIn">
                  <button class="fr-link" @click="showSignUpModal = true">
                    S'inscrire
                  </button>
                </li>
                <li>
                  <button
                    v-if="userStore.isLoggedIn"
                    class="fr-link"
                    :title="userStore.email"
                    @click="userStore.logout"
                  >
                    Se déconnecter
                  </button>
                  <button v-else class="fr-link" @click="showLoginModal = true">
                    Se connecter
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-header__body fr-header__nav">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div>
            <ul class="fr-links-group">
              <li v-if="userStore.isLoggedIn">
                <NuxtLink to="/">
                  <button>
                    Recherche
                    <VIcon class="fr-ml-1w" name="ri-search-line" />
                  </button>
                </NuxtLink>
              </li>
              <li v-if="userStore.isLoggedIn">
                <NuxtLink to="/label">
                  <button>Label</button>
                </NuxtLink>
              </li>
              <li v-if="userStore.isLoggedIn">
                <NuxtLink to="/a-propos">
                  <button>À propos</button>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
  <BaseEditGeneral
    v-if="showAddBaseModal"
    new
    @close="showAddBaseModal = false"
  />
  <AuthLoginModal v-if="showLoginModal" @close="showLoginModal = false" />
  <AuthSignupModal v-if="showSignUpModal" @close="showSignUpModal = false" />
</template>

<script lang="ts" setup>
import { useUserStore } from "~/stores/userStore"
import { useBaseStore } from "~/stores/baseStore"

const userStore = useUserStore()
const baseStore = useBaseStore()

const logoTitle = ["La base de la médiation ", "et de l’inclusion numérique"]

const showAddBaseModal = ref(false)
const showLoginModal = ref(false)
const showSignUpModal = ref(false)
const showBasesList = ref(false)

onFocusOut(
  () => (showBasesList.value = false),
  "header-bases-list",
  () => showBasesList.value
)
</script>

<style lang="sass" scoped>
.fr-header
  box-shadow: none
  border-bottom: var(--grey-925-125) 1px solid

  .fr-links-group li
    align-items: baseline

  .fr-header__nav
    border-top: 1px solid var(--border-default-grey)

    .fr-header__body-row
      padding: 0

    button
      padding: 16px 12px

.selector__menu
  max-height: calc(5 * var(--item-height))
  overflow-y: scroll
  top: 40px
</style>
