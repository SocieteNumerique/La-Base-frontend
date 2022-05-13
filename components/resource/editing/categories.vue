<template>
  <div>
    <h2 class="fr-h6">
      {{ titleFromSubMenu[subMenu] }}
    </h2>
    <p>
      {{ descriptionFromSubMenu[subMenu] }}
    </p>
    <TagSelector
      v-for="categoryName in categoryNamesFromSubMenu[subMenu]"
      :key="categoryName"
      :is-focused="focusedCategory === categoryName"
      :category="tagStore.categoryByName(categoryName)"
      @focus="focusCategory(categoryName)"
    />
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import TagSelector from "~/components/tag/selector.vue"
import { useTagStore } from "~/stores/tagStore"

const tagStore = useTagStore()

const focusedCategory = ref("")

const subMenu = computed(() => {
  return resourceStore.navigation.activeSubMenu
})
const titleFromSubMenu = {
  indexation: "Indexation",
  credits: "Crédits",
  territories: "Territoires",
  licence: "Licence",
}
const descriptionFromSubMenu = {
  indexation:
    "Cette indexation est générale, elle permettra, si votre ressource est publique, aux autres utilisateurs de la base de la trouver via le moteur de recherche.",
  credits: "Crédits",
  territories: "Territoires",
  licence: "Licence",
}

type CategoryNamesFromSubMenu = {
  [key: string]: string[]
}

const categoryNamesFromSubMenu: CategoryNamesFromSubMenu = {
  indexation: ["Format", "Fonction"],
  credits: [],
  territories: [],
  licence: [],
}
const resourceStore = useResourceStore()

const focusCategory = (categoryName: string) => {
  focusedCategory.value = categoryName
}
</script>
