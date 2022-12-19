<template>
  <div class="item full-width">
    <div class="full-width">
      <div class="is-flex is-justify-content-space-between full-width">
        <BaseLabel :base="base" class="is-flex-grow">
          <div class="full-width">
            <div
              style="max-width: 220px"
              class="text-overflow-ellipsis fr-text-action-high-grey fr-text--bold"
              @click="isPinned = !isPinned"
            >
              {{ base.title }}
            </div>
            <div v-if="isRootBase" class="fr-text-mention--grey">
              Base propriétaire
            </div>
            <template v-if="showResources">
              <div>
                <span @click="showCollections = !showCollections">
                  {{ collectionCount }} /
                  {{ base.collectionChoices.length }} collections
                  <VIcon
                    :name="
                      showCollections
                        ? `ri-arrow-up-s-line`
                        : `ri-arrow-down-s-line`
                    "
                    scale="0.9"
                  />
                </span>
              </div>
            </template>
          </div>
        </BaseLabel>
        <div>
          <DsfrCheckbox
            v-model="isPinned"
            :disabled="isRootBase"
            class="checkbox-without-margin checkbox-sm"
          />
        </div>
      </div>
      <div v-if="showCollections" style="margin-left: 38px">
        <PinMenuLineCollection
          v-for="collection of base.collectionChoices"
          :key="collection.id"
          :collection="collection"
          :resource-id="instanceId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { DsfrCheckbox } from "@gouvminint/vue-dsfr"
import { useModel } from "~/composables/modelWrapper"
import { PropType } from "vue"

const props = defineProps({
  baseId: { type: Number, required: true },
  isRootBase: { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
  instanceType: {
    type: String as PropType<"resource" | "collection">,
    default: "resource",
  },
  instanceId: { type: Number, required: true },
})

const isPinned = useModel<number>("modelValue")

const baseStore = useBaseStore()
const showCollections = ref(false)

const base = computed(() => {
  return baseStore.basesById[props.baseId]
})
const showResources = computed(() => {
  return (
    props.instanceType === "resource" &&
    Boolean(base.value.collectionChoices?.length)
  )
})
const collectionCount = computed(() => {
  return base.value.collectionChoices
    ? base.value.collectionChoices.filter((collection) =>
        collection.resources?.includes(props.instanceId)
      ).length
    : 0
})
</script>

<style lang="sass" scoped>
.checkbox-sm
  transform: scale(0.6)
</style>
