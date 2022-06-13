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
                <li style="align-items: baseline">
                  <NuxtLink to="/recherche">
                    <span class="fr-link fr-fi-search-line">Recherche</span>
                  </NuxtLink>
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
                    <NuxtLink to="/login">
                      <span class="fr-link fr-fi-lock-line">Se connecter</span>
                    </NuxtLink>
                  </template>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useUserStore } from "~/stores/userStore"

const userStore = useUserStore()

const logoTitle = ["La base de la médiation ", "et de l’inclusion numérique"]
</script>

<style lang="sass" scoped>
.fr-header
  box-shadow: none
  border-bottom: var(--grey-925-125) 1px solid
</style>
