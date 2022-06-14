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
                    @click="showAddModal"
                  >
                    Créer une base
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
  <DsfrModal
    :actions="addActions"
    title="Ajouter une base"
    :opened="showAddBaseModal"
    @close="showAddBaseModal = false"
  >
    <DsfrInput
      id="newBaseTitle"
      :model-value="newBaseTitle"
      label="Nom de la base"
      hint="max 100 caractères"
      maxlength="100"
      :label-visible="true"
      autofocus
      @update:model-value="onBaseTitleUpdate"
    />
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useUserStore } from "~/stores/userStore"
import { useBaseStore } from "~/stores/baseStore"

const userStore = useUserStore()
const baseStore = useBaseStore()

const logoTitle = ["La base de la médiation ", "et de l’inclusion numérique"]

const showAddBaseModal = ref(false)
const newBaseTitle = ref("")

const showAddModal = () => {
  showAddBaseModal.value = true
  setTimeout(() => {
    const el = document.getElementById("newBaseTitle")
    if (el) {
      el.focus()
    }
  }, 200)
}
const createBase = () => {
  baseStore.createBase(newBaseTitle.value)
}

const addActions = computed(() => [
  {
    label: "Valider",
    onClick: createBase,
    disabled: newBaseTitle.value.length === 0,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => (showAddBaseModal.value = false),
  },
])
const onBaseTitleUpdate = (value: string) => (newBaseTitle.value = value)
</script>

<style lang="sass" scoped>
.fr-header
  box-shadow: none
  border-bottom: var(--grey-925-125) 1px solid
</style>
