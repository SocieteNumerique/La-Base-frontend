<template>
  <div v-if="userStore.isLoggedIn" :id="containerId" class="selector">
    <BaseEditGeneral
      v-if="showAddBaseModal"
      :id="newBaseContainerId"
      new
      new-stay-on-page
      @close="showAddBaseModal = false"
      @done="pinInNewBase"
    />
    <button
      :class="{
        ...$attrs.class,
        'fr-btn--sm': small,
        'fr-btn--secondary': atLeastOnePin,
      }"
      class="fr-btn"
      @click="isMenuShown = !isMenuShown"
    >
      <span v-if="atLeastOnePin">
        Enregistrée
        <VIcon
          name="ri-arrow-down-s-line"
          style="position: relative; top: 2px"
        />
      </span>
      <span v-if="!atLeastOnePin">Enregistrer</span>
    </button>
    <div
      v-if="isMenuShown && pinStatuses"
      class="selector__menu fr-text-title--blue-france fr-text--xs"
    >
      <PinMenuLine
        v-if="iControlRootBase"
        :model-value="true"
        :base-id="rootBaseId"
        :is-root-base="true"
        :instance-id="instanceId"
        :instance-type="props.instanceType"
      />

      <PinMenuLine
        v-for="pinStatus of pinStatuses"
        :key="pinStatus.id"
        :model-value="pinStatus.isPinned"
        :base-id="pinStatus.id"
        :instance-id="instanceId"
        :instance-type="props.instanceType"
        @update:model-value="togglePin(pinStatus)"
      />
      <div class="item" @click="showAddBaseModal = true">
        <VIcon class="fr-mr-1w" name="ri-add-circle-line" />
        Créer une base
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { PropType } from "vue"
import { PinStatus } from "~/composables/types"
import { useUserStore } from "~/stores/userStore"
import { useResourceStore } from "~/stores/resourceStore"
import PinMenuLine from "~/components/base/PinMenuLine.vue"

const userStore = useUserStore()
const baseStore = useBaseStore()
const resourceStore = useResourceStore()

const props = defineProps({
  modelValue: { type: Array as PropType<number[]>, required: true },
  instanceId: { type: Number, required: true },
  rootBaseId: { type: Number, default: null },
  instanceType: {
    type: String as PropType<"resource" | "collection">,
    default: "resource",
  },
  small: { type: Boolean, default: true },
})
const isMenuShown = ref<boolean>(false)
const containerId = computed<string>(
  () => `pin-menu-${props.instanceType}-${props.instanceId}`
)
const newBaseContainerId = computed(() => `${containerId.value}-new-base-modal`)
const showAddBaseModal = ref<boolean>(false)
onFocusOut(
  () => (isMenuShown.value = false),
  containerId.value,
  () => isMenuShown.value
)
onFocusOut(
  () => (showAddBaseModal.value = false),
  newBaseContainerId.value,
  () => showAddBaseModal.value
)
const savedPinStatuses = useModel<number[]>("modelValue", {
  type: "array",
})
const iControlRootBase =
  baseStore.baseOptions.filter((base) => base.id === props.rootBaseId).length >
  0

function convertToPinStatuses(pinnedInBases: number[]) {
  return baseStore.baseOptions
    .filter(({ id }) => id !== props.rootBaseId)
    .map((base) => ({
      ...base,
      isPinned: pinnedInBases.includes(base.id),
    }))
}

const pinStatuses = ref(convertToPinStatuses(savedPinStatuses.value))
watch(
  savedPinStatuses,
  (value) => (pinStatuses.value = convertToPinStatuses(value))
)

const atLeastOnePin = computed<boolean>(() => {
  if (iControlRootBase) return true
  if (!pinStatuses.value) return false
  return pinStatuses.value.some((pinStatus: PinStatus) => pinStatus.isPinned)
})
const endpoint = computed<"resources" | "collections">(
  () => `${props.instanceType}s`
)
const frenchInstanceNames: { [key: string]: string } = {
  resource: "ressource",
  collection: "collection",
}
const verboseInstanceName = computed<string>(
  () => frenchInstanceNames[props.instanceType]
)

function pinInNewBase(baseId: number) {
  togglePin({ id: baseId, isPinned: false })
}

async function togglePin(pinStatus: PinStatus) {
  pinStatus.isPinned = !pinStatus.isPinned
  const actionName = pinStatus.isPinned ? "enregistrée à" : "retirée de"
  const baseName = baseStore.basesById[pinStatus.id].title
  const { data, error } = await useApiPatch<number[]>(
    `${endpoint.value}/${props.instanceId}/pin/`,
    pinStatus,
    {},
    {
      title: `La ${verboseInstanceName.value} a bien été ${actionName} la base ${baseName}`,
    },
    true
  )
  if (error.value) return convertToPinStatuses(savedPinStatuses.value)
  savedPinStatuses.value = data.value
  const instances = baseStore.basesById[pinStatus.id][endpoint.value]
  if (pinStatus.isPinned && instances?.indexOf(props.instanceId) === -1)
    instances.push(props.instanceId)
  if (
    props.instanceType === "resource" &&
    !resourceStore.resourcesById[props.instanceId]
  )
    await resourceStore.getResource(props.instanceId, true)
  if (!pinStatus.isPinned) instances?.filter((id) => id != props.instanceId)
}
</script>

<style lang="sass" scoped>
.selector .selector__menu
  max-height: calc(5 * var(--item-height))
  overflow-y: scroll
  width: 352px
  top: 40px

  .item
    .check, .cross, .unchangeable-check
      justify-self: end
      margin-left: auto

    .check, .cross
      display: none

    &:hover, &.-checked
      .check
        display: block

    &.-checked:hover
      .cross
        display: block

      .check
        display: none
</style>
