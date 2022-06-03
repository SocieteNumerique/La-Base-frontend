<template>
  <div :class="{ 'is-editing': isEditing }" class="content-container -list">
    <div class="toolbar fr-px-2w fr-text--xs">
      <div>Statut :</div>
      <div class="fr-btns-group--xs">
        <button
          :class="{ '-active': isEditing }"
          class="btn-tab-activable fr-btn--tertiary-no-outline"
          @click="$emit('open-edition')"
        >
          <VIcon name="ri-edit-line" />
          Éditer
        </button>
        <button class="fr-btn--tertiary-no-outline" disabled>
          <VIcon name="ri-settings-line" />
          Paramètres
        </button>
        <button class="fr-btn--tertiary-no-outline" @click="$emit('delete')">
          <VIcon name="ri-delete-bin-line" />
          Supprimer
        </button>
      </div>
    </div>
    <div class="fr-p-2w">
      <ContentDisplay
        v-show="!isEditing"
        :content="content"
        :is-editing-view="isEditingView"
      />
      <ContentInput
        v-if="isEditingView"
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
  isEditingView: { type: Boolean, default: true },
  isEditing: { type: Boolean, default: false },
})
defineEmits(["delete", "exit-edition", "open-edition"])

const content = useModel<Content>("modelValue", { type: "object" })
</script>

<style lang="sass" scoped>
.content-container.-list
  &.is-editing
    border: 1px solid var(--border-default-grey)
</style>
