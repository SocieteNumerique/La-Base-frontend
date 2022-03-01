<template>
  <div>
    <DsfrHeader
      v-model="query"
      :service-title="
        'Mes Outils pour l\'Inclusion NumériquE - v' + mainStore.version
      "
      :service-description="
        'référencer, découvrir, partager des outils pour l\'inclusion numérique'
      "
      logo-text="ANCT"
    />
    <div class="fr-container">
      <DsfrNavigation :nav-items="navItems"></DsfrNavigation>
    </div>

    <div class="fr-container">
      <slot />
    </div>

    <div style="background-color: var(--grey-1000-50) padding: 1rem">
      <DsfrFooter
        a11yCompliance="partiellement conforme"
        categoryName1="Mes outils"
        categoryName2="Mes outils"
        :linkList1="[
          {
            label: 'Lien 1.1',
            to: '/lien1/1',
          },
          {
            label: 'Lien 1.2',
            to: '/lien1/2',
          },
        ]"
        :linkList2="[
          {
            label: 'Lien 1.1',
            to: '/lien1/1',
          },
          {
            label: 'Lien 1.2',
            to: '/lien1/2',
          },
        ]"
        logo-text="ANCT"
        desc-text="descText"
        home-link="/"
        descText="référencer, découvrir, partager des outils pour l'inclusion numérique"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useMainStore } from "~/stores/mainStore";

const userStore = useUserStore()
if (!userStore.email) {
  // if profile is already got from SSR, do not fetch again
  userStore.refreshProfile()
}

const mainStore = useMainStore()
if (!mainStore.version) {
  mainStore.refreshVersion()
}

const query = ref("")

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
