<template>
  <div>
    <h2 class="fr-h6">
      {{ titleFromSubMenu[subMenu] }}
    </h2>
    <p>
      {{ descriptionFromSubMenu[subMenu] }}
    </p>
    <template
      v-for="categoryName in categoryNamesFromSubMenu[subMenu]"
      :key="categoryName"
    >
      <TagSelector
        v-if="tagStore.categoryBySlug(categoryName)"
        :is-focused="focusedCategory === categoryName"
        :category="tagStore.categoryBySlug(categoryName)"
        @focus="focusCategory(categoryName)"
        @blur="focusCategory('')"
      />
    </template>

    <ResourceEditingCredits v-if="resourceStore.isSubMenuActive('credits')" />
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
  credits:
    "Créditer la ressource, les producteurs seront visibles depuis la ressource",
  territories: "Territoires",
  licence: "Licence",
}

type CategoryNamesFromSubMenu = {
  [key: string]: string[]
}

const categoryNamesFromSubMenu: CategoryNamesFromSubMenu = {
  indexation: ["Format", "Function"],
  credits: [],
  territories: [],
  licence: [],
}
const resourceStore = useResourceStore()

const focusCategory = (categoryName: string) => {
  focusedCategory.value = categoryName
}
</script>
