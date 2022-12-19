<template>
  <div class="is-flex is-justify-content-space-between full-width">
    <div
      class="text-overflow-ellipsis fr-text-action-high-grey"
      style="max-width: 230px"
    >
      {{ collection.name }}
    </div>
    <div>
      <DsfrCheckbox
        :model-value="isPinned"
        class="checkbox-without-margin checkbox-sm"
        @update:modelValue="onUpdateCheckbox($event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DsfrCheckbox } from "@gouvminint/vue-dsfr"
import { PropType } from "vue"
import { Collection } from "~/composables/types"
import { useCollectionStore } from "~/stores/collectionStore"

const props = defineProps({
  collection: { type: Object as PropType<Collection>, required: true },
  resourceId: { type: Number, required: true },
})

const collectionStore = useCollectionStore()
const isPinned = ref<boolean>(
  props.collection!.resources!.includes(props.resourceId)
)

const onUpdateCheckbox = (newPinned: boolean) => {
  isPinned.value = newPinned
  collectionStore.updateResourceOnCollection(
    props.collection.id,
    props.resourceId,
    isPinned.value ? "add" : "remove"
  )
}
</script>

<style lang="sass" scoped></style>
