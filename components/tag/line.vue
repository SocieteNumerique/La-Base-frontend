<template>
  <div class="result-line">
    <div
      class="tag-line fr-py-1w"
      :class="disabled ? 'fr-text--disabled' : null"
    >
      <p
        class="fr-m-0 cursor--pointer fr-text--sm"
        :title="props.tag.name"
        @click="!disabled && emit('select')"
      >
        {{ props.tag.name }}
      </p>
      <div class="fr-text--sm fr-m-0 grid-tag-icons">
        <VIcon v-if="!props.tag.isFree" name="official-line" :scale="0.9" />
        <div v-else />
        <span class="tag-count">
          {{ props.tag?.count || 0 }}
        </span>
        <VIcon
          v-if="props.tag.definition"
          class="cursor--pointer"
          :name="showDefinition ? 'ri-information-line' : 'ri-information-fill'"
          :scale="0.9"
          @click="showDefinition = !showDefinition"
        />
        <span v-else class="no-information">-</span>
      </div>
    </div>
    <p v-if="showDefinition" class="fr-mb-1w fr-text--xs fr-text-default--grey">
      {{ props.tag.definition }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Tag } from "composables/types"
import { PropType } from "vue"

const props = defineProps({
  tag: { type: Object as PropType<Tag>, required: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(["select"])

const showDefinition = ref(false)
</script>

<style lang="sass">
.tag-line
  display: flex
  justify-content: space-between
  p
    text-overflow: ellipsis
    white-space: nowrap
    max-width: 270px
    overflow: hidden


.grid-tag-icons
  display: grid
  grid-auto-flow: column
  grid-template-columns: 16px 30px 15px
  grid-column-gap: 8px
  align-items: center
  text-align: center

  > span
    display: inline-block
</style>
