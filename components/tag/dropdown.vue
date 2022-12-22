<template>
  <div
    :id="rootId"
    class="tag-dropdown fr-text--sm fr-mb-2w"
    :class="isFocused ? '-active' : null"
    style="position: relative"
  >
    <button
      class="cursor--pointer dropdown-title fr-text-label--blue-france"
      @click="onTitleClick"
    >
      <slot name="label">
        {{ props.category.name }}
      </slot>
      <VIcon
        style="padding-left: 4px; position: relative; top: 3px"
        name="ri-arrow-down-s-line"
      />
    </button>
    <div
      class="dropdown-tags"
      :class="isFocused ? 'with-border-top' : null"
      :style="dropdownStyle"
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
import { onMounted, PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { onEscape } from "~/composables/onEscape"

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

const tagStore = useTagStore()

const emit = defineEmits(["focus", "blur", "select", "change"])
const isRightOfScreen = ref(false)

// dropdown is aligned right when positioned on the right of the screen, else
// aligned on the left
const rootId = "tag-dropdown-" + props.category.id
const dropdownStyle = computed(() => {
  let toReturn = props.isFocused ? "max-height: 300px;" : "max-height: 0;"
  toReturn += isRightOfScreen.value ? "right: 0" : "left: 8px"
  return toReturn
})
// checking position on mounted
onMounted(() => {
  const el = document.getElementById(rootId)
  if (el!.getBoundingClientRect().x > (2 / 3) * window.innerWidth) {
    isRightOfScreen.value = true
  }
})

const onTitleClick = () => emit(props.isFocused ? "blur" : "focus")
const possibleTags = computed(() =>
  props.category.tags
    .filter((tag) => props.selectedTags.indexOf(tag) === -1)
    .map((tagId) => tagStore.tagsById[tagId])
)
const isTagEnabled = (tagId: number) => {
  if (!props.enabledTags) {
    return true
  }
  return props.enabledTags.indexOf(tagId) !== -1
}

onFocusOut(
  () => emit("blur"),
  `tag-dropdown-${props.category.id}`,
  () => props.isFocused
)
onEscape(
  () => emit("blur"),
  () => props.isFocused
)

const selectTag = (tagId: number) => {
  emit("select", tagId)
}
</script>

<style scoped>
.dropdown-tags {
  transition: max-height 0.2s ease-in-out 0s;
  width: 400px;
  overflow-y: auto;
  position: absolute;
  margin-top: 10px;
  margin-left: -8px;
  background: white;
  z-index: 100;
  box-shadow: 4px 4px 4px var(--grey-975-75-hover),
    -4px 4px 4px var(--grey-975-75-hover);
}
.dropdown-tags.with-border-top {
  border-top: 1px solid var(--grey-975-75-hover);
}
.tag-dropdown {
  border: 1px solid var(--background-disabled-grey);
  padding: 4px 8px;
  border-radius: 4px;
}
.tag-dropdown.-active {
  border: 1px solid var(--text-action-high-blue-france);
}
</style>
