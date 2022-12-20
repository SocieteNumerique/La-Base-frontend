<template>
  <ul class="fr-text--md fr-px-0">
    <li
      v-for="user of users"
      :key="user.id"
      class="item has-children-space-between"
    >
      <div class="fr-text--sm fr-mb-0">
        {{ user.firstName }} {{ user.lastName }}
      </div>
      <button
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-text-title--blue-france action"
        @click="$emit('remove', user.id)"
      >
        <VIcon class="fr-mr-2v" name="ri-close-line" />
        Retirer
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { User } from "~/composables/types"

defineEmits(["remove"])
defineProps({
  users: { type: Array as PropType<User[]>, default: () => [] },
})
</script>

<style scoped lang="sass">
.item
  border-bottom: 1px solid var(--border-default-grey)
  padding: 12px
  padding-left: 0
  display: flex
  align-items: center
  width: 100%
  height: 44px

  .action
    display: none
    margin-left: auto

  &:hover .action
    display: block
</style>
