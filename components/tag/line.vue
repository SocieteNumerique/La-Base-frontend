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
      <div class="fr-text--sm fr-m-0">
        <VIcon
          v-if="!props.tag.isFree"
          name="ri-shield-check-line"
          :scale="0.9"
        />
        <span v-if="props.tag.count" class="tag-count">
          {{ props.tag.count }}
        </span>
        <template v-if="props.tag.definition">
          <VIcon
            v-if="showDefinition"
            class="cursor--pointer"
            name="ri-information-fill"
            :scale="0.9"
            style="margin-left: 8px"
            @click="showDefinition = !showDefinition"
          />
          <VIcon
            v-else
            class="cursor--pointer fr-ml-1w"
            name="ri-information-line"
            :scale="0.9"
            @click="showDefinition = !showDefinition"
          />
        </template>
        <template v-else>
          <span class="no-information"> - </span>
        </template>
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

.no-information
  display: inline-block
  margin-left: 14px
  margin-right: 7px

.tag-count
  display: inline-block
  margin-left: 8px
  min-width: 26px
</style>
