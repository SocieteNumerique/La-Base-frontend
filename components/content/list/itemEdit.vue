<template>
  <div
    :class="isEditing ? 'is-editing fr-mt-5w' : null"
    class="content-container"
  >
    <div v-if="!isEditing" class="toolbar fr-pt-1v fr-pr-2w fr-text--xs">
      <div>
        <button
          class="content-drag-handle"
          style="position: absolute; margin-left: -30px"
        >
          <img
            src="~/assets/svg/dragHandle.svg"
            alt="Curseur pour déplacer l'élément par glisser-déposer"
          />
        </button>
        <!-- <span>Statut :</span> -->
      </div>
      <div class="fr-btns-group--xs fr-ml-auto">
        <button
          :class="{ '-active': isEditing }"
          class="btn-tab-activable fr-btn--tertiary-no-outline fr-mr-4v fr-pb-1v"
          @click="$emit('open-edition')"
        >
          <VIcon name="ri-edit-line" />
          Éditer
        </button>
        <!--<button class="fr-btn--tertiary-no-outline fr-mr-4v fr-pb-1v" disabled>
          <VIcon name="ri-settings-3-line" />
          Paramètres
        </button>-->
        <ContentButtonDeleteContent full @delete="$emit('delete')" />
      </div>
    </div>
    <div class="fr-p-2w">
      <ContentInput
        v-if="isEditing"
        v-model="content"
        @exit="$emit('exit-edition')"
        @delete="$emit('delete')"
      />
      <ContentDisplay v-else :content="content" :is-editing-view="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { Content } from "~/composables/types"
import { useModel } from "~/composables/modelWrapper"

defineProps({
  modelValue: { type: Object as PropType<Content>, required: true },
  isEditing: { type: Boolean, default: false },
})
defineEmits(["delete", "exit-edition", "open-edition"])

const content = useModel<Content>("modelValue", { type: "object" })
</script>

<style lang="sass" scoped>
.content-drag-handle
  cursor: move
  cursor: -webkit-grabbing

.content-container
  &.is-editing
    border: 1px solid var(--border-default-grey)
</style>
