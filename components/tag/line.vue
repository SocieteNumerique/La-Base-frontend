<template>
  <div class="result-line">
    <div
      class="tag-line fr-py-1w"
      :class="disabled ? 'fr-text--disabled' : null"
    >
      <p class="fr-m-0 cursor--pointer" @click="!disabled && emit('select')">
        {{ props.tag.name }}
      </p>
      <div>
        <VIcon v-if="!props.tag.isFree" name="ri-shield-check-line" />
        <span
          v-if="props.tag.count"
          style="display: inline-block; margin-left: 8px"
        >
          {{ props.tag.count }}
        </span>
        <template v-if="props.tag.definition">
          <VIcon
            v-if="showDefinition"
            class="cursor--pointer"
            name="ri-information-fill"
            @click="showDefinition = !showDefinition"
          />
          <VIcon
            v-else
            class="cursor--pointer"
            name="ri-information-line"
            @click="showDefinition = !showDefinition"
          />
        </template>
      </div>
    </div>
    <p v-if="showDefinition" class="fr-mb-1w fr-text--xs">
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
</style>
