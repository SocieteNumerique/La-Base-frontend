<template>
  <div :id="containerId" class="selector">
    <button
      :class="{ '-active': isMenuShown }"
      class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline btn-tab-activable"
      @click="isMenuShown = !isMenuShown"
    >
      <VIcon
        class="fr-text-title--blue-france fr-mr-2v"
        name="ri-settings-3-line"
      />
      <span>Paramètres</span>
    </button>

    <div v-show="isMenuShown" class="selector__menu fr-px-2w fr-text--xs">
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
    <BaseEditDelete v-if="openStep === 'delete'" @close="openStep = ''" />
  </div>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"

const openStep = ref<string>("")
const isMenuShown = ref<boolean>(false)
const baseStore = useBaseStore()

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
    label: "Supprimer la base",
    step: "delete",
  },
]
</script>

<style lang="sass" scoped>
.selector > .fr-btn > span
  color: black
</style>
