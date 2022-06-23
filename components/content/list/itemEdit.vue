<template>
  <div :class="{ 'is-editing': isEditing }" class="content-container">
    <div class="toolbar fr-px-2w fr-text--xs">
      <div>
        <button class="content-drag-handle fr-ml-n5v">
          <img src="~/assets/svg/dragHandle.svg" />
        </button>
        <!-- <span>Statut :</span> -->
      </div>
      <div class="fr-btns-group--xs fr-ml-auto">
        <button
          :class="{ '-active': isEditing }"
          class="btn-tab-activable fr-btn--tertiary-no-outline"
          @click="$emit('open-edition')"
        >
          <VIcon name="ri-edit-line" />
          Éditer
        </button>
        <!--<button class="fr-btn--tertiary-no-outline" disabled>
          <VIcon name="ri-settings-3-line" />
          Paramètres
        </button>-->
        <ContentButtonDeleteContent full @delete="$emit('delete')" />
      </div>
    </div>
    <div class="fr-p-2w">
      <ContentDisplay
        v-show="!isEditing"
        :content="content"
        :is-editing-view="true"
      />
      <ContentInput
        v-show="isEditing"
        v-model="content"
        @exit="$emit('exit-edition')"
      />
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
