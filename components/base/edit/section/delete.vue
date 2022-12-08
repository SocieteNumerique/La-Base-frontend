<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    :title="modalTitle"
    @close="onClose()"
  >
    <p>
      Êtes-vous sûr de vouloir supprimer cette rubrique ? Cette action est
      irréversible.
    </p>
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { BaseSection } from "~/composables/types"
import { computed } from "vue"
import { useRoute } from "vue-router"
import DsfrModal from "~/components/DsfrResizableModal.vue"
import { useResourceStore } from "~/stores/resourceStore"
import { useBaseSectionStore } from "~/stores/baseSectionStore"
import { deepCopy } from "~/composables/utils"

const baseStore = useBaseStore()
const resourceStore = useResourceStore()
const baseSectionStore = useBaseSectionStore()
const route = useRoute()

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const emits = defineEmits(["close", "save", "done"])
const modalTitle = "Supprimer la rubrique à la une"

const onClose = () => {
  emits("close")
}

const actions = computed(() => [
  {
    label: "Oui",
    onClick: () => {
      baseSectionStore.delete(props.id)
      onClose()
    },
    disabled: false,
  },
  {
    label: "Non",
    secondary: true,
    onClick: onClose,
  },
])
</script>

<style lang="sass">
.type-radios
  legend
    font-weight: normal
</style>
