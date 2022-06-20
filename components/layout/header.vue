<template>
  <header class="fr-header" role="banner">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <NuxtLink to="/"><DsfrLogo :logo-text="logoTitle" /></NuxtLink>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-links-group">
                <li style="align-items: baseline">
                  <NuxtLink to="/">
                    <span class="fr-link fr-fi-home-4-line">Accueil</span>
                  </NuxtLink>
                </li>
                <li v-if="userStore.isLoggedIn" style="align-items: baseline">
                  <button
                    class="fr-link fr-fi-add-circle-line"
                    @click="showAddBaseModal = true"
                  >
                    Ajouter une base
                  </button>
                </li>
                <li style="align-items: baseline">
                  <template v-if="userStore.isLoggedIn">
                    <span>Connecté</span>
                    <span
                      style="display: inline-block"
                      class="fr-text--xs fr-text--light fr-ml-1w"
                    >
                      ({{ userStore.email }})
                    </span>
                  </template>
                  <template v-else>
                    <span
                      class="fr-link fr-fi-lock-line cursor--pointer"
                      @click="showLoginModal = true"
                    >
                      Se connecter
                    </span>
                  </template>
                </li>
                <li v-if="!userStore.isLoggedIn" style="align-items: baseline">
                  <span
                    class="fr-link fr-fi-add-circle-line cursor--pointer"
                    @click="showSignUpModal = true"
                  >
                    Créer un compte
                  </span>
                </li>
                <li v-if="userStore.isLoggedIn" style="align-items: baseline">
                  <span
                    class="fr-link fr-fi-logout-box-r-line cursor--pointer"
                    @click="userStore.logout"
                  >
                    Déconnexion
                  </span>
                </li>
              </ul>
            </div>
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

const userStore = useUserStore()

const logoTitle = ["La base de la médiation ", "et de l’inclusion numérique"]

const showAddBaseModal = ref(false)
const showLoginModal = ref(false)
const showSignUpModal = ref(false)
</script>

<style lang="sass" scoped>
.fr-header
  box-shadow: none
  border-bottom: var(--grey-925-125) 1px solid
</style>
