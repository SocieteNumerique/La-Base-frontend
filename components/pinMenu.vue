<template>
  <div :id="containerId" class="selector">
    <button
      :class="{
        ...$attrs.class,
        'fr-btn--sm': small,
        'fr-btn--secondary': atLeastOnePin,
      }"
      class="fr-btn"
      @click="isMenuShown = !isMenuShown"
    >
      <span v-show="atLeastOnePin">
        Enregistrée
        <VIcon name="ri-arrow-down-s-line" />
      </span>
      <span v-show="!atLeastOnePin">Enregistrer</span>
    </button>
    <div
      v-if="pinStatusByBaseId"
      v-show="isMenuShown"
      class="selector__menu fr-px-2w fr-text-title--blue-france fr-text--xs"
    >
      <template v-for="{ id, isPinned } of pinStatusByBaseId" :key="id">
        <div v-if="id === rootBaseId" class="item fr-text-default--grey">
          <div>
            {{ baseStore.basesById[id]?.title }}
            <div class="fr-text-mention--grey">Base propriétaire</div>
          </div>
          <VIcon class="unchangeable-check" name="ri-checkbox-circle-fill" />
        </div>
        <div
          v-else
          :class="isPinned ? '-checked' : ''"
          class="item"
          @click="togglePin({ id, isPinned: isPinned })"
        >
          {{ baseStore.basesById[id]?.title }}
          <VIcon class="check" name="ri-check-line" />
          <VIcon class="cross" name="ri-close-line" />
        </div>
      </template>
      <div class="item">
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

const props = defineProps({
  modelValue: { type: Array as PropType<PinStatus[]>, required: true },
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
onFocusOut(
  () => (isMenuShown.value = false),
  containerId.value,
  () => isMenuShown.value
)
const baseStore = useBaseStore()

const savedPinStatusByBaseId = useModel<PinStatus[]>("modelValue", {
  type: "array",
})
const pinStatusByBaseId = ref<PinStatus[]>(props.modelValue)
watch(savedPinStatusByBaseId, (value) => (pinStatusByBaseId.value = value))

const atLeastOnePin = computed<boolean>(() => {
  if (!pinStatusByBaseId.value) return false
  return pinStatusByBaseId.value.some(
    (pinStatus: PinStatus) => pinStatus.isPinned
  )
})
const endpoint = computed<string>(() => `${props.instanceType}s`)
const frenchInstanceNames: { [key: string]: string } = {
  resource: "ressource",
  collection: "collection",
}
const verboseInstanceName = computed<string>(
  () => frenchInstanceNames[props.instanceType]
)

async function togglePin(pinStatus: PinStatus) {
  pinStatus.isPinned = !pinStatus.isPinned
  const actionName = pinStatus.isPinned ? "enregistrée à" : "retirée de"
  const baseName = baseStore.basesById[pinStatus.id].title
  const { data, error } = await useApiPatch<PinStatus[]>(
    `${endpoint.value}/${props.instanceId}/pin/`,
    pinStatus,
    {},
    {
      title: `La ${verboseInstanceName.value} a bien été ${actionName} la base ${baseName}`,
    },
    true
  )
  if (error.value)
    return (pinStatusByBaseId.value = savedPinStatusByBaseId.value)
  savedPinStatusByBaseId.value = data.value
}
</script>

<style lang="sass" scoped>
.selector .selector__menu .item
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
