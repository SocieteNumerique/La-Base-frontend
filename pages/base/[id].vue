<template>
  <NuxtLayout name="default">
    <template #header>
      <div class="fr-background-alt--grey fr-pb-4w fr-pt-10w">
        <div class="fr-container">
          <div
            v-if="base.canWrite"
            class="has-children-space-between fr-text--sm fr-text-default--grey fr-mb-2w pre-header"
          >
            <div>Statut : {{ stateLabel[base.state] }}</div>
            <BaseSettings />
          </div>
          <h1 style="max-width: 800px">{{ base?.title }}</h1>
          <div class="is-flex base-meta">
            <DsfrTags
              v-if="participantTypes"
              :tags="participantTypes"
              class="fr-mr-3w actor-tags"
            />
            <div v-if="territory" class="territory">
              <VIcon
                class="fr-mr-2v fr-text-title--blue-france"
                name="ri-map-pin-line"
              />
              {{ territory }}
            </div>
          </div>
          <!-- <div
            style="border-bottom: 1px solid var(--border-default-grey)"
            class="fr-my-3w"
          />
          <div class="has-children-space-between">
            <div class="is-flex">
              <div class="stat">
                <span class="fr-h5">45</span>
                <span class="fr-text-label--blue-france">enregistrements</span>
              </div>
              <div class="stat">
                <span class="fr-h5">45</span>
                <span class="fr-text-label--blue-france">mentions</span>
              </div>
              <div class="stat">
                <span class="fr-h5">45</span>
                <span class="fr-text-label--blue-france">vues</span>
              </div>
            </div>
            <div v-if="base?.reports" class="is-flex">
              <DsfrBadge label="2 signalements erreur type 3" type="warning" />
            </div>
          </div> -->
        </div>
      </div>
    </template>

    <div>
      <ShareButton :link="route.fullPath">
        <RoundButton icon="ri-share-line" label="Partager" />
      </ShareButton>
      <RoundButton icon="ri-equalizer-line" label="Évaluer" disabled />
      <RoundButton icon="ri-download-line" label="Télécharger" disabled />
      <RoundButton icon="ri-share-line" label="Signaler" disabled />
    </div>
    <div
      style="border-bottom: 1px solid var(--border-default-grey)"
      class="fr-my-3w"
    ></div>

    <div class="fr-btns-group">
      <button
        :class="{ '-active': tab === 'resources' }"
        class="btn-tab-activable fr-btn--tertiary-no-outline fr-px-1v fr-pt-2v fr-pb-3v fr-text-title--blue-france fr-h4 fr-mr-5w"
        @click="tab = 'resources'"
      >
        Ressources
      </button>
      <button
        :class="{ '-active': tab === 'about' }"
        class="btn-tab-activable fr-btn--tertiary-no-outline fr-px-1v fr-pt-2v fr-pb-3v fr-text-title--blue-france fr-h4"
        @click="tab = 'about'"
      >
        À propos
      </button>
    </div>

    <BaseResources v-show="tab === 'resources'" :base="base" />
    <BaseAbout
      v-show="tab === 'about'"
      :actor-types="participantTypes"
      :base="base"
      :territory="territory"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { computed, onBeforeMount } from "vue"
import RoundButton from "~/components/roundButton.vue"
import { useBaseStore } from "~/stores/baseStore"
import { useUserStore } from "~/stores/userStore"
import { useAlertStore } from "~/stores/alertStore"
import { useTagStore } from "~/stores/tagStore"
import { stateLabel } from "~/composables/strUtils"

definePageMeta({
  layout: false,
  title: "Base",
})
const route = useRoute()
const router = useRouter()
const baseStore = useBaseStore()
const tagStore = useTagStore()

const tab = ref<string>("resources")

const participantTypes = computed<{ label: string }[]>(
  () =>
    base.value?.participantTypeTags?.map((tagId: number) => {
      return { label: tagStore.tagsById[tagId]?.name, small: true }
    }) || []
)
const territory = computed<string>(() =>
  (
    base.value?.territoryTags?.map((id) => tagStore.tagsById[id].name) || []
  ).join(", ")
)

const getBaseIfNotExists = async () => {
  const baseId = parseInt(<string>route.params.id)
  baseStore.currentId = baseId
  if (!baseStore.basesById[baseId] || baseStore.basesById[baseId].isShort) {
    return await baseStore.getBase(baseId)
  }
  return Promise.resolve({
    error: ref(false),
    data: ref(baseStore.basesById[baseId]),
  })
}

const base = computed(() => {
  return baseStore.current
})

if (process.server) {
  getBaseIfNotExists()
}
onBeforeMount(async () => {
  // prefill email if exists
  if (route.query.email) {
    const userStore = useUserStore()
    userStore.prefillEmail = <string>route.query.email
    router.replace({ path: route.path, query: {} })
  }

  // fetch base
  const { error } = await getBaseIfNotExists()

  // if we have no access to this base, redirect to home or login
  if (error.value) {
    console.log("### error", error.value)
    const alertStore = useAlertStore()
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      alertStore.alert(
        "Veuillez vous connecter pour avoir accès à cette base",
        "",
        "warning"
      )
      router.push({ path: "/connexion", query: { next: route.path } })
    } else {
      alertStore.alert("Vous n'avez pas accès à cette base", "", "warning")
      router.push("/")
    }
  }
})
</script>

<style lang="sass" scoped>
.stat
  margin-left: -12px

.stat + .stat
  margin-left: 12px

.stat *
  margin-left: 12px

.base-meta
  align-items: center

  .territory
    color: black
    font-size: 0.75rem
</style>

<style lang="sass">
.base-meta .actor-tags .fr-tag
  margin-bottom: 0
</style>
