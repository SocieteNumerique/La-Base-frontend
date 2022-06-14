<template>
  <div :id="'tag-dropdown-' + props.category.id" class="tag-dropdown">
    <div
      class="cursor--pointer"
      :class="isFocused ? 'underlined' : null"
      @click="onTitleClick"
    >
      {{ props.category.name }}
      <VIcon name="ri-arrow-down-s-line" />
    </div>
    <div
      style="
        transition: max-height 0.4s ease-in-out 0s;
        overflow-y: auto;
        position: absolute;
        background: white;
        z-index: 100;
        box-shadow: 4px 4px 4px var(--grey-975-75-hover),
          -4px 4px 4px var(--grey-975-75-hover);
      "
      :style="isFocused ? 'max-height: 300px' : 'max-height: 0'"
    >
      <template v-if="isFocused">
        <TagLine
          v-for="tag in possibleTags"
          :key="tag.id"
          :tag="tag"
          :disabled="!isTagEnabled(tag.id)"
          @select="selectTag(tag.id)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TagCategory } from "~/composables/types"
import { computed, PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"

const tagStore = useTagStore()

const emit = defineEmits(["focus", "blur", "select", "change"])

const onTitleClick = () => emit(props.isFocused ? "blur" : "focus")
const possibleTags = computed(() =>
  props.category.tags
    .filter((tag) => props.selectedTags.indexOf(tag) === -1)
    .map((tagId) => tagStore.tagsById[tagId])
)
const isTagEnabled = (tagId: number) => {
  if (props.enabledTags == null) {
    return true
  }
  return props.enabledTags.indexOf(tagId) !== -1
}

const props = defineProps({
  category: {
    type: Object as PropType<TagCategory>,
    required: true,
  },
  isFocused: {
    type: Boolean,
    default: false,
  },
  selectedTags: {
    type: Array as PropType<number[]>,
    required: true,
  },
  enabledTags: {
    type: Array as PropType<number[]>,
    default: null,
  },
})

onFocusOut(
  () => emit("blur"),
  `tag-dropdown-${props.category.id}`,
  () => props.isFocused
)

const selectTag = (tagId: number) => {
  emit("select", tagId)
}
</script>

<style scoped>
.underlined {
  border-bottom: 2px solid #000091;
}
</style>
