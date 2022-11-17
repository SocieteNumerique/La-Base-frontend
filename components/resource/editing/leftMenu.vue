<template>
  <div class="fr-pr-2w full-height">
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
    <div v-else class="full-height">
      <nav
        class="fr-sidemenu fr-sidemenu--sticky my-navigation"
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
                v-for="menu in navigationMenus"
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
                    :aria-expanded="
                      resourceStore.isMenuActive(menu.key) &&
                      isMenuOpen[menu.key]
                    "
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
                      resourceStore.isMenuActive(menu.key) &&
                      isMenuOpen[menu.key]
                        ? ''
                        : 'fr-collapse'
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
                          :disabled="
                            navigationMenuByKey[menu.key].subMenus[subMenu.key]
                              .disabled
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
        <div
          class="fr-mt-7w"
          style="display: flex; flex-direction: column; max-width: 160px"
        >
          <DsfrButton
            :secondary="true"
            label="Pré-visualiser"
            icon="ri-eye-line"
            class="fr-mb-3v fr-btn--sm"
            :disabled="false"
            style="width: 100%"
            @click="doShowPreview"
          />
          <DsfrButton
            label="Sauvegarder"
            icon="ri-save-line"
            class="fr-mb-3v fr-btn--sm"
            @click="save"
          />
          <DsfrButton
            v-if="canDelete"
            :secondary="true"
            label="Supprimer"
            icon="ri-delete-bin-line"
            class="fr-mb-3v fr-btn--sm"
            @click="ongoingDeletion = true"
          />
          <template v-if="isClient">
            <DsfrButton
              icon="ri-arrow-go-back-line"
              class="fr-mb-3v fr-btn--tertiary-no-outline fr-btn--sm"
              label="Retour à la base"
              @click="goTo('base')"
            />
            <DsfrButton
              icon="ri-arrow-right-line"
              class="fr-btn--sm fr-btn--tertiary-no-outline"
              label="Aller à la fiche"
              @click="goTo('resource')"
            />
          </template>
        </div>
      </nav>
    </div>
    <DsfrModal
      v-if="showPreview"
      class="full-width-modal"
      style="width: 100%"
      title=""
      :opened="true"
      @close="showPreview = false"
    >
      <ResourceView :is-preview="true" />
    </DsfrModal>
    <DsfrModal
      v-if="ongoingDeletion"
      :actions="actions"
      :opened="true"
      title="Supprimer la ressource"
      @close="ongoingDeletion = false"
    >
      Confirmez-vous la suppression de la ressource ? <br />
      Tous les contenus de la ressource seront supprimés avec elle.
    </DsfrModal>
    <DsfrModal
      v-if="isNavigating !== ''"
      :actions="goToActions"
      title="Modifications en cours"
      :opened="true"
      @close="isNavigating = ''"
    >
      <p>
        Vous avez des modifications en cours, voulez-vous les ignorer ou
        continuer l'édition ?
      </p>
    </DsfrModal>
  </div>
</template>

<script setup lang="ts">
import {
  useResourceStore,
  navigationMenus,
  navigationMenuByKey,
} from "~/stores/resourceStore"
import { computed } from "vue"
import { useBaseStore } from "~/stores/baseStore"
import { useRouter } from "vue-router"

const showPreview = ref(false)
const resourceStore = useResourceStore()
const baseStore = useBaseStore()
const router = useRouter()
let isClient = false
if (process.client) {
  isClient = true
}

const save = () => {
  resourceStore.save()
}
const isMenuOpen = ref<{ [key: string]: boolean }>({ informations: true })
const deleteResource = async () => {
  ongoingDeletion.value = false
  const baseId = resourceStore.current.rootBase
  const { error, id } = await resourceStore.delete()
  if (!error.value) {
    setTimeout(() => {
      delete resourceStore.resourcesById[id]
    }, 200)
    useRouter().push(`/base/${baseId}`)
  }
}
const doShowPreview = () => {
  showPreview.value = true
}
const canDelete = computed(() => {
  const baseId = resourceStore.current.rootBase
  if (!(baseId && baseId in baseStore.basesById)) return false
  return baseStore.basesById[baseId].canWrite || false
})

const selectSubMenu = (subMenu: string) => {
  if (
    navigationMenuByKey[resourceStore.navigation.activeMenu].subMenus[subMenu]
      .disabled
  ) {
    return
  }
  resourceStore.navigation.activeSubMenu = subMenu
}
const selectMenu = (menuKey: string) => {
  const wasAlreadyActive = resourceStore.navigation.activeMenu === menuKey
  resourceStore.navigation.activeMenu = menuKey
  if (wasAlreadyActive) {
    isMenuOpen.value[menuKey] = !isMenuOpen.value[menuKey]
  } else {
    isMenuOpen.value[menuKey] = true
  }

  // if we go into a new menu with sub-menus, select first sub-menu
  if (
    !wasAlreadyActive &&
    Object.keys(navigationMenuByKey[menuKey].subMenus).length
  ) {
    for (const menu of navigationMenus) {
      if (menu.key === menuKey) {
        resourceStore.navigation.activeSubMenu = menu.subMenus[0].key
      }
    }
  }
}

const ongoingDeletion = ref<boolean>(false)
const actions = [
  {
    label: "Oui",
    onClick: async () => deleteResource(),
  },
  {
    label: "Non",
    secondary: true,
    onClick: () => (ongoingDeletion.value = false),
  },
]

const baseHref = computed(() => {
  return "/base/" + resourceStore.current?.rootBase
})
const resourceHref = computed(() => "/ressource/" + resourceStore.currentId)
const isNavigating = ref<"" | "resource" | "base">("")
const goToActions = computed(() => {
  const target = isNavigating.value === "resource" ? "resource" : "base"
  return [
    {
      label: "Continuer l'édition",
      onClick: () => {
        isNavigating.value = ""
      },
    },
    {
      label: "Aller à la " + (target === "resource" ? "ressource" : "base"),
      secondary: true,
      onClick: () => {
        goTo(target, false)
      },
    },
  ]
})

const goTo = (target: "resource" | "base", check = true) => {
  console.log("### goto", target, check)
  if (check && resourceStore.current.dirty) {
    // show confirmation modal
    isNavigating.value = target
  } else {
    // navigate
    router.push(target == "resource" ? resourceHref.value : baseHref.value)
  }
}
</script>

<style lang="sass">
.full-height
  height: 100%
</style>
