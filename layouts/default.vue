<script setup lang="ts">
import { BASE_URL } from "~/composables/api"
import { useCounter } from "~/stores/counter"
import { useUserStore } from "~/stores/userStore"

const counter = useCounter()
const userStore = useUserStore()
userStore.refreshProfile()


const query = ref("")

const version = useFetch<{ version: number }>(BASE_URL + "/api/version").data

const goFetch = () => {
  console.log("Fetching with query:", query.value)
}
const baseNavItems = [
  {
    to: "/",
    text: "Accueil",
  },
  {
    to: "/other",
    text: "Autre page",
  },
  {
    title: "Menu déroulant",
    links: [
      {
        text: "Lien 1",
        to: "#",
      },
      {
        text: "Lien 2",
        to: "#",
      },
    ],
  },
]

const navItems = () => {
  let newItem;
  if (userStore.email) {
    newItem = { text: `Mon compte (${userStore.email})`, to: "profile" }
  } else {
    newItem = { text: "Connexion", to: "login" }
  }
  console.log("navitems", newItem)
  return baseNavItems.concat(newItem)
}

</script>

<template>
  <Html lang="fr">
    <Head>
      <Title>Banque d'outils pour l'inclusion</Title>
    </Head>
  </Html>

  <DsfrHeader
    v-model="query"
    :service-title="
      'Mes Outils pour l\'Inclusion NumériquE - v' + version.version
    "
    :service-description="
      'référencer, découvrir, partager des outils pour l\'inclusion numérique' +
      counter
    "
    logo-text="ANCT"
    show-search
    @search="goFetch()"
  />
  <div class="fr-container">
    <DsfrNavigation :nav-items="navItems()"></DsfrNavigation>
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
</template>
