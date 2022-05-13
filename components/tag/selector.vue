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
          v-for="tag in possibleTags"
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
        <button class="fr-m-0 fr-text--md fr-text-label--blue-france">
          <VIcon name="ri-add-circle-line" />
          Suggérer un nouveau tag
        </button>
      </div>
      <div class="fr-px-2w fr-py-1w fr-tags-group">
        <li v-for="tag in selectedTags" :key="tag.id">
          <button class="fr-tag" @click="removeTag(tag.id)">
            {{ tag.name }}
            <VIcon name="ri-close-line" />
          </button>
        </li>
      </div>
    </div>
    <h2 class="fr-h4">{{ inputValue }}</h2>
  </div>
</template>

<script setup lang="ts">
import { Tag, TagCategory } from "~/composables/types"
import { computed, onMounted, PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { useResourceStore } from "~/stores/resourceStore"

const tagStore = useTagStore()
const resourceStore = useResourceStore()

const inputValue = ref("")
const emit = defineEmits(["focus"])

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

onMounted(() => {
  console.log("### mounted, category", props.category, possibleTags.value)
})

const selectedTags = computed((): Tag[] => {
  resourceStore.current.tags
  console.log("### selected tags", resourceStore.current.tags)
  return props.category?.tags
    .filter(
      (tagId: number) => resourceStore.current.tags?.indexOf(tagId) !== -1
    )
    .map((tagId: number): Tag => tagStore.tagsById[tagId])
})

const possibleTags = computed(() => {
  tagStore.tagsById
  props.category
  // possible tags are the one from the category that have not been selected yet
  console.log("### possible tags", props.category, tagStore.tagsById)
  return props.category?.tags
    .filter(
      (tagId: number) => resourceStore.current.tags?.indexOf(tagId) === -1
    )
    .map((tagId: number): Tag => tagStore.tagsById[tagId])
})

const selectTag = (tagId: number) => {
  console.log("### select tag", tagId)
  resourceStore.addTagToResource(tagId, resourceStore.currentId!)
}
const removeTag = (tagId: number) => {
  console.log("### remove tag", tagId)
  resourceStore.removeTagFromResource(tagId, resourceStore.currentId!)
}
</script>
