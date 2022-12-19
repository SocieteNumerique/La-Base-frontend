<template>
  <header class="fr-header" role="banner">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row fr-py-2w">
          <LayoutLogo class="fr-ml-3w" />
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-links-group">
                <li
                  v-if="userStore.isLoggedIn"
                  id="header-bases-list"
                  class="selector"
                >
                  <template v-if="baseStore.hasBases">
                    <IntroTooltip slug="MY_BASES">
                      <button
                        :class="{ '-active': showBasesList }"
                        class="fr-link btn-tab-activable"
                        @click="showBasesList = !showBasesList"
                      >
                        Mes bases
                        <VIcon
                          :name="`ri-arrow-${
                            showBasesList ? 'up' : 'down'
                          }-s-line`"
                          class="fr-ml-3v"
                        />
                      </button>
                    </IntroTooltip>
                    <div
                      v-show="showBasesList"
                      class="selector__menu fr-px-2w fr-text--xs over-sticky"
                    >
                      <NuxtLink
                        v-for="base of baseStore.baseOptions"
                        :key="base.id"
                        :to="`/base/${base.id}`"
                        class="item"
                        style="width: 100%"
                      >
                        <BaseLabel :base="base" />
                      </NuxtLink>
                      <div
                        class="item fr-text-title--blue-france"
                        @click="showAddBaseModal = true"
                      >
                        Créer une base
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <IntroTooltip slug="CREATE_BASES">
                      <button class="fr-link" @click="showAddBaseModal = true">
                        Créer une base
                      </button>
                    </IntroTooltip>
                  </template>
                </li>
                <li v-if="!userStore.isLoggedIn">
                  <button
                    class="fr-link"
                    @click="userStore.showSignUpModal = true"
                  >
                    S'inscrire
                  </button>
                </li>
                <li id="profile-menu" class="selector">
                  <template v-if="userStore.isLoggedIn">
                    <IntroTooltip slug="MY_PROFILE">
                      <button
                        :class="{ '-active': showProfileMenu }"
                        class="fr-link btn-tab-activable"
                        @click="showProfileMenu = !showProfileMenu"
                      >
                        Mon profil
                        <VIcon
                          :name="`ri-arrow-${
                            showBasesList ? 'up' : 'down'
                          }-s-line`"
                          class="fr-ml-3v"
                        />
                      </button>
                    </IntroTooltip>

                    <div
                      v-show="showProfileMenu"
                      class="selector__menu fr-px-2w fr-text--xs over-sticky"
                      style="overflow-x: hidden; overflow-y: auto"
                    >
                      <div
                        class="item fr-link"
                        style="
                          padding-top: 11px !important;
                          padding-bottom: 11px !important;
                          height: initial;
                          cursor: default;
                        "
                      >
                        <div>
                          <span class="fr-text--bold"
                            >{{ userStore.firstName }}
                            {{ userStore.lastName }}</span
                          >
                          <br />
                          <span class="fr-text--sm fr-text--disabled">{{
                            userStore.email
                          }}</span>
                        </div>
                      </div>
                      <NuxtLink to="/profil-informations" class="item fr-link">
                        <button class="fr-p-0">Modifier le profil</button>
                      </NuxtLink>
                      <button
                        v-if="userStore.isLoggedIn"
                        class="fr-link item"
                        :title="userStore.email"
                        @click="onLogOutClick"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </template>
                  <button v-else class="fr-link" @click="showLoginModal = true">
                    Se connecter
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-header__body fr-header__nav">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <ul class="fr-links-group">
            <li>
              <NuxtLink to="/">
                <button>Accueil</button>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/recherche">
                <button>Recherche</button>
              </NuxtLink>
            </li>
            <li v-for="page of pages" :key="page.slug">
              <NuxtLink :to="'/page/' + page.slug">
                <button>
                  {{ page.title }}
                  <VIcon v-if="page.icon" class="fr-ml-1w" :name="page.icon" />
                </button>
              </NuxtLink>
            </li>

            <template v-if="userStore.isCnfs">
              <li class="fr-ml-auto">
                <NuxtLink to="/base/3">
                  <button>
                    <img
                      alt="icone CNFS"
                      class="fr-mr-1w fr-mb-n1v"
                      src="/logos/cnfs.png"
                      height="19"
                    />
                    CNFS
                  </button>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/base/34">
                  <button>
                    <img
                      alt="icone CNFS"
                      class="fr-mr-1w fr-mb-n1v"
                      src="/logos/cnfs.png"
                      height="19"
                    />
                    CNFS - Contributeurs
                  </button>
                </NuxtLink>
              </li>
            </template>
          </ul>
          <ul class="fr-links-group" style="justify-content: flex-end">
            <li>
              <NuxtLink to="/favoris">
                <button class="fr-btn--tertiary-no-outline fr-text--sm">
                  Mes bases favorites
                </button>
              </NuxtLink>
            </li>
            <li>
              <button
                class="fr-btn--tertiary-no-outline fr-text--sm"
                @click="introStore.showAllInPage"
              >
                <VIcon name="ri-question-line" class="fr-mr-1w" scale="0.85" />
                Didacticiel
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
  <BaseEditGeneral
    v-if="showAddBaseModal"
    new
    @close="showAddBaseModal = false"
  />
  <AuthLoginModal v-if="showLoginModal" @close="showLoginModal = false" />
  <AuthSignupModal
    v-if="userStore.showSignUpModal"
    @close="userStore.showSignUpModal = false"
  />
</template>

<script lang="ts" setup>
import { useUserStore } from "~/stores/userStore"
import { useBaseStore } from "~/stores/baseStore"
import { useRouter } from "vue-router"
import { computed } from "vue"
import { usePageStore } from "~/stores/pageStore"
import { useIntroStore } from "~/stores/introStore"

const userStore = useUserStore()
const baseStore = useBaseStore()
const pageStore = usePageStore()
const router = useRouter()
const introStore = useIntroStore()

const showAddBaseModal = ref(false)
const showLoginModal = ref(false)
const showBasesList = ref(false)
const showProfileMenu = ref(false)

onFocusOut(
  () => (showBasesList.value = false),
  "header-bases-list",
  () => showBasesList.value
)
onFocusOut(
  () => (showProfileMenu.value = false),
  "profile-menu",
  () => showProfileMenu.value
)

const onLogOutClick = () => {
  userStore.logout()
  router.push("/")
  router.replace({
    query: { ...useRoute().query, update: new Date().getMilliseconds() },
  })
}
const pages = computed(() => pageStore.pages)
</script>

<style lang="sass" scoped>
.selector__menu
  max-height: calc(5 * var(--item-height))
  overflow-y: scroll
  top: 40px

.over-sticky
  z-index: 12

.fr-links-group
  a
    font-size: 14px
    button
      line-height: 1.5rem
</style>
