<template>
  <div>
    <div class="fr-input-group fr-mb-0">
      <label
        v-if="props.category.name"
        class="fr-label"
        :for="'category-input-' + props.category.id"
        >{{ props.category.name }}
        <span v-if="props.category.description" class="fr-hint-text">
          {{ props.category.description }}
        </span>
      </label>
      <div class="fr-search-bar fr-input-group">
        <input
          :id="'category-input-' + props.category.id"
          v-model="inputValue"
          class="fr-input"
          type="text"
          @focus="emit('focus')"
        />
        <button class="fr-btn">
          <VIcon name="ri-search-line" />
        </button>
      </div>
    </div>
    <div style="transition: height ease-in-out 1s; height: 100%">
      <template v-if="isFocused">
        <TagLine
          v-for="tag in filteredTags"
          :key="tag.id"
          :tag="tag"
          @select="selectTag(tag.id)"
        />
      </template>
      <div
        v-if="isFocused"
        class="fr-px-2w fr-py-1w"
        style="border-bottom: 1px solid #e5e5e5"
      >
        <button
          class="fr-m-0 fr-text--md fr-text-label--blue-france"
          @click="onSuggestAddingTag"
        >
          <VIcon name="ri-add-circle-line" />
          Suggérer un nouveau tag
        </button>
      </div>
      <ul class="fr-px-2w fr-py-1w fr-tags-group">
        <li v-for="tag in selectedTags" :key="tag.id">
          <button class="fr-tag" @click="removeTag(tag.id)">
            {{ tag.name }}
            <VIcon name="ri-close-line" />
          </button>
        </li>
      </ul>
    </div>
    <TagAddModal
      v-if="showAddModal"
      :tag-category-id="props.category.id"
      @close="showAddModal = false"
      @created="onTagCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { Tag, TagCategory } from "~/composables/types"
import { computed, PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { useResourceStore } from "~/stores/resourceStore"

const tagStore = useTagStore()
const resourceStore = useResourceStore()

const inputValue = ref("")
const emit = defineEmits(["focus", "blur"])

const props = defineProps({
  category: {
    type: Object as PropType<TagCategory>,
    required: true,
  },
  isFocused: {
    type: Boolean,
    default: false,
  },
})

const showAddModal = ref(false)

const selectedTags = computed((): Tag[] => {
  resourceStore.current?.tags
  return props.category?.tags
    .filter(
      (tagId: number) => resourceStore.current?.tags?.indexOf(tagId) !== -1
    )
    .map((tagId: number): Tag => tagStore.tagsById[tagId])
})

const possibleTags = computed(() => {
  tagStore.tagsById
  props.category
  // possible tags are the one from the category that have not been selected yet
  return props.category?.tags
    .filter(
      (tagId: number) => resourceStore.current?.tags?.indexOf(tagId) === -1
    )
    .map((tagId: number): Tag => tagStore.tagsById[tagId])
})

const filteredTags = computed(() => {
  // filtered tags are the possible tags that match the search input
  let tags = possibleTags.value
  if (!inputValue.value) {
    return tags
  }
  let keepTags = []
  const searchInput = inputValue.value.toLowerCase()
  for (const tag of tags) {
    const words = tag.name.toLowerCase().split(" ")
    if (
      words.some(function (word) {
        return word.startsWith(searchInput)
      })
    ) {
      keepTags.push(tag)
    }
  }
  return keepTags
})

const selectTag = (tagId: number) => {
  resourceStore.addTagToResource(tagId, resourceStore.currentId!)
}
const removeTag = (tagId: number) => {
  resourceStore.removeTagFromResource(tagId, resourceStore.currentId!)
}

const onSuggestAddingTag = () => {
  showAddModal.value = true
}

const onTagCreated = (tagId: number) => {
  showAddModal.value = false
  // the added tag is selected
  selectTag(tagId)
  // so we can blur input, as if we're done choosing tags
  emit("blur")
}
</script>
