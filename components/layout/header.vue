<template>
  <header class="fr-header" role="banner">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <LayoutLogo class="fr-ml-3w" />
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
                      <VIcon
                        :name="`ri-arrow-${
                          showBasesList ? 'up' : 'down'
                        }-s-line`"
                        class="fr-ml-3v"
                      />
                    </button>
                    <div
                      v-show="showBasesList"
                      id="header-bases-list"
                      class="selector__menu fr-px-2w fr-text--xs"
                    >
                      <NuxtLink
                        v-for="base of baseStore.baseOptions"
                        :key="base.id"
                        :to="`/base/${base.id}`"
                        class="item"
                      >
                        <BaseLabel :base="base" />
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
                  <button
                    class="fr-link"
                    @click="userStore.showSignUpModal = true"
                  >
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
          <ul class="fr-links-group">
            <li>
              <NuxtLink to="/">
                <button>
                  Recherche
                  <VIcon class="fr-ml-1w" name="ri-search-line" />
                </button>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/label">
                <button>Label</button>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/a-propos">
                <button>À propos</button>
              </NuxtLink>
            </li>
            <template v-if="userStore.isCnfs">
              <li class="fr-ml-auto">
                <NuxtLink to="/base/3">
                  <button>
                    <img
                      alt="icone CNFS"
                      class="fr-mr-1w fr-mb-n1v"
                      src="/logos/cnfs.png"
                      height="19"
                    />
                    CNFS
                  </button>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/base/34">
                  <button>
                    <img
                      alt="icone CNFS"
                      class="fr-mr-1w fr-mb-n1v"
                      src="/logos/cnfs.png"
                      height="19"
                    />
                    CNFS - Contributeurs
                  </button>
                </NuxtLink>
              </li>
            </template>
          </ul>
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
  <AuthSignupModal
    v-if="userStore.showSignUpModal"
    @close="userStore.showSignUpModal = false"
  />
</template>

<script lang="ts" setup>
import { useUserStore } from "~/stores/userStore"
import { useBaseStore } from "~/stores/baseStore"

const userStore = useUserStore()
const baseStore = useBaseStore()

const logoTitle = ["La base du numérique", "d'intérêt général"]

const showAddBaseModal = ref(false)
const showLoginModal = ref(false)
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
    button
      font-size: 1em //safari needs it

  .fr-header__nav
    border-top: 1px solid var(--border-default-grey)

    .fr-header__body-row
      padding: 0

    .fr-links-group
      justify-content: start

    button
      padding: 16px 12px

.selector__menu
  max-height: calc(5 * var(--item-height))
  overflow-y: scroll
  top: 40px
</style>
