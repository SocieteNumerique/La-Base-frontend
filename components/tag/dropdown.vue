<template>
  <div :id="'tag-dropdown-' + props.category.id" class="tag-dropdown">
    <div
      class="cursor--pointer dropdown-title fr-text-label--blue-france"
      :class="isFocused ? 'underlined' : null"
      @click="onTitleClick"
    >
      <slot name="label">
        {{ props.category.name }}
      </slot>
      <VIcon name="ri-arrow-down-s-line" />
    </div>
    <div
      class="dropdown-tags"
      :style="isFocused ? 'max-height: 300px' : 'max-height: 0'"
    >
      <template v-if="isFocused">
        <slot
          name="tag-lines"
          :on-select="selectTag"
          :is-tag-enabled="isTagEnabled"
        >
          <TagLine
            v-for="tag in possibleTags"
            :key="tag.id"
            :tag="tag"
            :disabled="!isTagEnabled(tag.id)"
            @select="selectTag(tag.id)"
          />
        </slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TagCategory } from "~/composables/types"
import { PropType } from "vue"
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
  if (props.enabledTags === undefined) {
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
    default: undefined,
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
.dropdown-title {
  border-bottom: 2px solid transparent;
}
.dropdown-title.underlined {
  border-bottom: 2px solid #000091;
}
.dropdown-tags {
  transition: max-height 0.2s ease-in-out 0s;
  width: 400px;
  overflow-y: auto;
  position: absolute;
  background: white;
  z-index: 100;
  box-shadow: 4px 4px 4px var(--grey-975-75-hover),
    -4px 4px 4px var(--grey-975-75-hover);
}
</style>
