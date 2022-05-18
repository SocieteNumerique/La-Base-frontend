<template>
  <div>
    <h2 class="fr-h6">
      {{ subMenu.name }}
    </h2>
    <p>
      {{ subMenu.description }}
    </p>
    <ResourceEditingTerritory
      v-if="resourceStore.isSubMenuActive('territory')"
    />
    <template v-if="showTagSelection">
      <template
        v-for="categoryName in categoryNamesFromSubMenu[subMenu.key]"
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
    </template>

    <ResourceEditingCredits v-if="resourceStore.isSubMenuActive('credits')" />
    <ResourceEditingLicense v-if="resourceStore.isSubMenuActive('license')" />
  </div>
</template>

<script setup lang="ts">
import { useResourceStore, navigationMenuByKey } from "~/stores/resourceStore"
import TagSelector from "~/components/tag/selector.vue"
import { useTagStore } from "~/stores/tagStore"
import { Ref } from "vue"
import { SubMenu } from "~/composables/types"

const tagStore = useTagStore()

const focusedCategory = ref("")

const subMenu = computed((): SubMenu => {
  return navigationMenuByKey[resourceStore.navigation.activeMenu].subMenus[
    resourceStore.navigation.activeSubMenu
  ]
})

const showTagSelection = computed(() => {
  if (subMenu.value.key === "territory") {
    return resourceStore.current.isLinkedToATerritory
  }
  return true
})

type CategoryNamesFromSubMenu = {
  [key: string]: string[]
}

const categoryNamesFromSubMenu: Ref<CategoryNamesFromSubMenu> = computed(() => {
  const toReturn: CategoryNamesFromSubMenu = {}
  for (const key of Object.keys(
    navigationMenuByKey[resourceStore.navigation.activeMenu].subMenus
  )) {
    toReturn[key] = tagStore.tagCategoriesOrder
      .map((categoryId) => tagStore.tagCategoriesById[categoryId])
      .map((category) => category.slug)
      .filter((slug) => slug.startsWith(key))
  }
  return toReturn
})
const resourceStore = useResourceStore()

const focusCategory = (categoryName: string) => {
  focusedCategory.value = categoryName
}
</script>
