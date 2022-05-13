<template>
  <div class="fr-pr-2w">
    <div
      v-if="
        false && resourceStore.isCreating && resourceStore.creationStepIndex < 2
      "
    >
      <h2 class="fr-h4 fr-text-title--blue-france">Initialisation</h2>
      <div class="fr-text--xs">
        Nous avons besoin de quelques informations essentielles pour créer la
        ressource.
      </div>
    </div>
    <div v-else>
      <nav
        class="fr-sidemenu fr-sidemenu--sticky"
        role="navigation"
        aria-label="Menu latéral"
      >
        <div class="fr-sidemenu__inner">
          <button
            class="fr-sidemenu__btn"
            aria-controls="fr-sidemenu-wrapper"
            aria-expanded="false"
          >
            Menu
          </button>
          <div id="fr-sidemenu-wrapper" class="fr-collapse">
            <ul class="fr-sidemenu__list">
              <li
                v-for="menu in menus"
                :key="menu.key"
                class="fr-sidemenu__item"
                :class="
                  resourceStore.isMenuActive(menu.key)
                    ? 'fr-sidemenu__item--active'
                    : ''
                "
              >
                <template v-if="menu.subMenus.length">
                  <button
                    class="fr-sidemenu__btn"
                    :aria-expanded="resourceStore.isMenuActive(menu.key)"
                    aria-controls="fr-sidemenu-item-0"
                    :aria-current="
                      resourceStore.isMenuActive(menu.key) ? 'page' : null
                    "
                    @click="selectMenu(menu.key)"
                  >
                    {{ menu.name }}
                  </button>
                  <div
                    v-if="menu.subMenus.length"
                    id="fr-sidemenu-item-0"
                    :class="
                      resourceStore.isMenuActive(menu.key) ? '' : 'fr-collapse'
                    "
                  >
                    <ul class="fr-sidemenu__list">
                      <li
                        v-for="subMenu in menu.subMenus"
                        :key="subMenu.key"
                        class="fr-sidemenu__item"
                        :class="
                          resourceStore.isSubMenuActive(subMenu.key)
                            ? 'fr-sidemenu__item--active'
                            : ''
                        "
                      >
                        <button
                          class="fr-sidemenu__link"
                          :aria-current="
                            resourceStore.isSubMenuActive(subMenu.key)
                              ? 'page'
                              : null
                          "
                          @click="selectSubMenu(subMenu.key)"
                        >
                          {{ subMenu.name }}
                        </button>
                      </li>
                    </ul>
                  </div>
                </template>
                <template v-else>
                  <button
                    :aria-current="
                      resourceStore.isMenuActive(menu.key) ? 'page' : null
                    "
                    class="fr-sidemenu__link"
                    @click="selectMenu(menu.key)"
                  >
                    {{ menu.name }}
                  </button>
                </template>
              </li>
            </ul>
          </div>
        </div>
        <div class="fr-pb-3w" style="display: flex; flex-direction: column">
          <DsfrButton
            :secondary="true"
            label="Prévisualiser"
            icon="ri-eye-line"
          />
          <DsfrButton label="Sauvegarder" icon="ri-save-line" />
          <DsfrButton
            :secondary="true"
            label="Supprimer"
            icon="ri-delete-bin-line"
          />
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { computed } from "vue"

type SubMenu = {
  key: string
  name: string
}

type Menu = {
  key: string
  name: string
  subMenus: SubMenu[]
}

const menus: Menu[] = [
  {
    key: "informations",
    name: "Informations",
    subMenus: [
      { key: "general", name: "Général" },
      { key: "indexation", name: "Indexation" },
      { key: "credits", name: "Crédits" },
      { key: "territory", name: "Territoire" },
      { key: "licence", name: "Licence" },
      { key: "label", name: "Label" },
    ],
  },
  {
    key: "contents",
    name: "Contenus",
    subMenus: [],
  },
  {
    key: "parameters",
    name: "Paramètres",
    subMenus: [],
  },
]

const resourceStore = useResourceStore()

const boldIfMenuActive = computed(() => (menuName: string) => {
  return resourceStore.isMenuActive(menuName)
    ? "fr-text--bold"
    : "fr-text--regular"
})
const boldIfSubMenuActive = computed(() => (menuName: string) => {
  return resourceStore.isSubMenuActive(menuName)
    ? "fr-text--bold"
    : "fr-text--regular"
})
const styleIfSubMenuActive = computed(() => (menuName: string) => {
  return resourceStore.isSubMenuActive(menuName) ? "" : "padding-left: 52px"
})
const iconIfSubMenuActive = computed(() => (menuName: string) => {
  return resourceStore.isSubMenuActive(menuName) ? "ri-arrow-right-line" : ""
})
const selectSubMenu = (subMenu: string) => {
  resourceStore.navigation.activeSubMenu = subMenu
}
const selectMenu = (menu: string) => {
  resourceStore.navigation.activeMenu = menu
}
</script>

<style lang="sass"></style>
