<template>
  <div :id="containerId" class="selector">
    <IntroTooltip :slug="showIntro ? 'BASES_SETTINGS' : ''">
      <button
        :class="{ '-active': isMenuShown }"
        class="fr-btn fr-btn--sm fr-btn--secondary btn-tab-activable"
        @click="isMenuShown = !isMenuShown"
      >
        <VIcon
          class="fr-text-title--blue-france fr-mr-2v"
          name="ri-settings-3-line"
        />
        <span class="fr-text-title--blue-france">Paramètres de la base</span>
      </button>
    </IntroTooltip>

    <div
      v-show="isMenuShown"
      class="selector__menu fr-text--xs"
      style="z-index: 13; width: 200px"
    >
      <div
        v-for="({ label, step }, index) of menuOptions"
        :key="index"
        class="item"
        @click="open(step)"
      >
        {{ label }}
      </div>
    </div>

    <BaseEditGeneral
      v-if="openStep === 'general'"
      @close="openStep = ''"
      @save="updateBase"
    />
    <BaseEditImages
      v-if="openStep === 'images'"
      @close="openStep = ''"
      @save="updateBase"
    />
    <BaseEditAdmins
      v-if="openStep === 'admin'"
      @close="openStep = ''"
      @save="updateBase"
    />
    <BaseEditContributors
      v-if="openStep === 'contributors'"
      @close="openStep = ''"
      @save="updateBase"
    />
    <BaseEditState
      v-if="openStep === 'status'"
      @close="openStep = ''"
      @save="updateBase"
    />
    <BaseEditCertification
      v-if="openStep === 'certification'"
      @close="openStep = ''"
    />
    <BaseEditSection
      v-if="openStep === 'section'"
      @close="openStep = ''"
      @save="updateBase"
    />
    <BaseEditDelete v-if="openStep === 'delete'" @close="openStep = ''" />
    <BaseExportModal v-if="openStep === 'export'" @close="openStep = ''" />
  </div>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { useRoute } from "vue-router"

const openStep = ref<string>("")
const isMenuShown = ref<boolean>(false)
const baseStore = useBaseStore()
const route = useRoute()

const showIntro = computed(() => {
  return ((route.query.tab as string) || "presentation") === "presentation"
})

const containerId = "base-settings"
onFocusOut(
  () => (isMenuShown.value = false),
  containerId,
  () => isMenuShown.value
)

function open(step: string) {
  openStep.value = step
  isMenuShown.value = false
}

async function updateBase(data: any) {
  const { error } = await baseStore.update(data)
  if (!error.value) openStep.value = ""
}

const menuOptions = [
  {
    label: "Informations",
    step: "general",
  },
  {
    label: "Images de profil",
    step: "images",
  },
  {
    label: "Administrateurs",
    step: "admin",
  },
  {
    label: "Contributeurs",
    step: "contributors",
  },
  {
    label: "Statut de la base",
    step: "status",
  },
  {
    label: "Rubriques à la une",
    step: "section",
  },
  {
    label: "Certifier la base",
    step: "certification",
  },
  {
    label: "Exporter la base",
    step: "export",
  },
  {
    label: "Supprimer la base",
    step: "delete",
  },
]
</script>

<style lang="sass" scoped>
.selector > .fr-btn > span
  color: black
</style>
