<template>
  <TagRadioSelector
    v-if="category.radioDisplay && mode === 'set'"
    :category="category"
    :init-tags="initTags"
    :source="source"
    :label="label"
    :mode="mode"
    @change="$emit('change', $event)"
  />
  <TagSearchSelector
    v-else
    :category="category"
    :is-focused="isFocused"
    :init-tags="initTags"
    :source="source"
    :label="label"
    :mode="mode"
    @blur="$emit('blur')"
    @change="$emit('change', $event)"
    @focus="$emit('focus')"
  />
</template>

<script setup lang="ts">
import { TagCategory } from "~/composables/types"
import { PropType } from "vue"

defineEmits(["focus", "blur", "select", "change"])

defineProps({
  category: {
    type: Object as PropType<TagCategory>,
    required: true,
  },
  isFocused: {
    type: Boolean,
    default: false,
  },
  source: {
    type: String,
    default: "CurrentResource",
  },
  initTags: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
  label: {
    type: String,
    default: null,
  },
  mode: { type: String as PropType<"filter" | "set">, default: "set" },
})
</script>
