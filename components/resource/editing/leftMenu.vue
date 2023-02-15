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
        <div class="fr-sidemenu__inner" style="overflow: visible">
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
                  <IntroTooltip
                    :slug="
                      showIntros ? `LEFT_MENU_${menu.key.toUpperCase()}` : null
                    "
                  >
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
                  </IntroTooltip>
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
                  <IntroTooltip
                    :slug="
                      showIntros ? `LEFT_MENU_${menu.key.toUpperCase()}` : null
                    "
                  >
                    <button
                      :aria-current="
                        resourceStore.isMenuActive(menu.key) ? 'page' : null
                      "
                      class="fr-sidemenu__link"
                      @click="selectMenu(menu.key)"
                    >
                      {{ menu.name }}
                    </button>
                  </IntroTooltip>
                </template>
              </li>
            </ul>
          </div>
        </div>
        <div class="bottom-button-holder fr-mt-7w">
          <IntroTooltip
            :slug="showIntros ? 'DUPLICATES_DETECTOR' : null"
            class="fr-mb-7v"
          >
            <button
              class="fr-btn fr-btn--icon-left fr-btn--tertiary-no-outline fr-btn--sm fr-px-0"
              :class="{
                'fr-text-default--error': duplicatedResourceIds.length,
              }"
              :disabled="duplicatedResourceIds.length === 0"
              @click="showDuplicateResourcesModal = true"
            >
              <span class="fr-pr-1w fr-pt-1v">
                <VIcon
                  :name="
                    duplicatedResourceIds.length
                      ? 'ri-alert-fill'
                      : 'ri-checkbox-circle-line'
                  "
                />
              </span>
              {{ duplicatedResourceIds.length }}
              {{
                pluralize(
                  ["doublon détecté", "doublons détectés"],
                  duplicatedResourceIds.length
                )
              }}
            </button>
          </IntroTooltip>
          <IntroTooltip
            :slug="showIntros ? 'LEFT_MENU_PREVIEW' : null"
            class="fr-mb-3v"
          >
            <DsfrButton
              :secondary="true"
              label="Pré-visualiser"
              icon="ri-eye-line"
              class="fr-btn--sm"
              :disabled="false"
              style="width: 100%"
              @click="doShowPreview"
            />
          </IntroTooltip>
          <IntroTooltip
            :slug="showIntros ? 'LEFT_MENU_SAVE' : null"
            class="fr-mb-3v"
          >
            <DsfrButton
              label="Sauvegarder"
              icon="ri-save-line"
              class="fr-btn--sm"
              @click="save"
            />
          </IntroTooltip>
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
    <ResourceEditingDuplicateResourcesModal
      :opened="showDuplicateResourcesModal"
      :duplicate-resource-ids="duplicatedResourceIds"
      @close="onCloseDuplicateResourceModal()"
    />
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
import { useIncrementRouterQuery } from "~/composables/incrementRouterQuery"
import { useCollectionStore } from "~/stores/collectionStore"

const showPreview = ref(false)
const resourceStore = useResourceStore()
const collectionStore = useCollectionStore()
const baseStore = useBaseStore()
const router = useRouter()

const incrementRouterQuery = useIncrementRouterQuery()

const showIntros = computed(() => {
  return resourceStore.navigation.activeMenu == "informations"
})

let isClient = false
if (process.client) {
  isClient = true
}
const {
  showDuplicateResourcesModal,
  duplicatedResourceIds,
  verifyDuplicatedResource,
  onCloseDuplicateResourceModal,
} = useDuplicateResourceDetector()

onMounted(() => {
  verifyDuplicatedResource()
})

const save = async () => {
  const resourceCollections = resourceStore.current.collections
  const currentResourceId = resourceStore.currentId!
  const { error } = await resourceStore.save()

  // update the collections where the resource was a member
  if (!error.value && resourceCollections != null) {
    const currentId = resourceStore.currentId
    for (const collectionId of baseStore.basesById[
      resourceStore.current.rootBase!
    ].collections!) {
      const collection = collectionStore.collectionsById[collectionId]
      if (collection == null) {
        // nothing to update
        return
      }
      if (resourceCollections.indexOf(collectionId) === -1) {
        // remove resource from collection
        collection.resources = collection.resources!.filter(
          (resourceId) => resourceId !== currentResourceId
        )
      } else {
        // add resource to collection
        if (collection.resources!.indexOf(currentResourceId) === -1) {
          collection.resources!.push(currentResourceId)
        }
      }
    }
  }
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
    router.push(`/base/${baseId}`)
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
  incrementRouterQuery()
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
  incrementRouterQuery()

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
.bottom-button-holder
  display: flex
  flex-direction: column
  max-width: 175px

  button
    width: 100%
</style>
