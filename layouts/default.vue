<template>
  <div data-fr-theme>
    <LayoutHeader />
    <slot name="header">
      <div class="fr-container fr-mt-4w">
        <div v-if="route.meta.title" class="fr-grid-row">
          <h1>{{ route.meta.title }}</h1>
        </div>
      </div>
    </slot>
    <div class="fr-container fr-mt-4w">
      <div class="fr-mb-11v">
        <slot />
      </div>
    </div>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"

const route = useRoute()

const userStore = useUserStore()

const baseNavItems = [
  {
    to: "/",
    text: "Accueil",
  },
]

const navItems = computed(() => {
  userStore.email
  let newItem
  if (userStore.email) {
    newItem = { text: userStore.email, to: "/profile" }
  } else {
    newItem = { text: "Connexion", to: "/login" }
  }
  return baseNavItems.concat(newItem)
})
</script>
