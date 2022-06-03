<template>
  <div :id="'tag-selector-' + props.category.id" class="tag-selector">
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
    <ul class="fr-px-2w fr-pt-1w fr-tags-group">
      <li v-for="tag in selectedTags" :key="tag.id">
        <button class="fr-tag" @click="removeTag(tag.id)">
          {{ tag.name }}
          <VIcon name="ri-close-line" />
        </button>
      </li>
    </ul>
    <div
      style="
        transition: max-height 0.4s ease-in-out 0s;
        overflow-y: auto;
        height: 100%;
        margin-top: -8px;
      "
      :style="isFocused ? 'max-height: 300px' : 'max-height: 0'"
    >
      <template v-if="isFocused">
        <TagLine
          v-for="tag in filteredTags"
          :key="tag.id"
          :tag="tag"
          @select="selectTag(tag.id)"
        />
      </template>
    </div>
    <div
      v-if="isFocused && props.category.acceptsFreeTags"
      class="fr-px-2w fr-py-1w"
      style="border-bottom: 1px solid #e5e5e5"
    >
      <button
        class="fr-m-0 fr-text--md fr-text-label--blue-france"
        @click="onSuggestAddingTag"
      >
        <VIcon name="ri-add-circle-line" />
        Ajouter un nouveau tag
      </button>
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
import { computed, PropType, onMounted, onBeforeUnmount } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { useResourceStore } from "~/stores/resourceStore"
import { useAlertStore } from "~/stores/alertStore"

const tagStore = useTagStore()
const resourceStore = useResourceStore()
const alertStore = useAlertStore()

const inputValue = ref("")
const emit = defineEmits(["focus", "blur", "select", "change"])

const ownSelectedTags = ref<number[]>([])

const onClick = (ev: Event) => {
  if (!props.isFocused) {
    return
  }
  const container = document.getElementById("tag-selector-" + props.category.id)
  if (!container!.contains(ev!.target)) {
    emit("blur")
  }
}

onMounted(() => {
  document.addEventListener("mouseup", onClick)
})
onBeforeUnmount(() => {
  document.removeEventListener("mouseup", onClick)
})

const props = defineProps({
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
})

const showAddModal = ref(false)

const sourceTags = computed((): number[] | undefined => {
  resourceStore.current?.tags

  if (props.source === "CurrentResource") {
    return resourceStore.current?.tags
  } else {
    return ownSelectedTags.value
  }
})

const selectedTags = computed((): Tag[] => {
  sourceTags
  return props.category?.tags
    .filter((tagId: number) => sourceTags.value?.indexOf(tagId) !== -1)
    .map((tagId: number): Tag => tagStore.tagsById[tagId])
})

const possibleTags = computed(() => {
  tagStore.tagsById
  props.category
  // possible tags are the one from the category that have not been selected yet
  return props.category?.tags
    .filter((tagId: number) => sourceTags.value?.indexOf(tagId) === -1)
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
  if (
    props.category.maximumTagCount &&
    selectedTags.value.length >= props.category.maximumTagCount
  ) {
    console.log(
      "### already selected the maximum number of tags",
      selectedTags,
      props.category.maximumTagCount
    )
    alertStore.alert(
      "Nombre maximum de tags",
      "Le nombre maximum de tag pour cette catégorie est de " +
        props.category.maximumTagCount,
      "warning"
    )
    return
  }

  if (props.source === "CurrentResource") {
    resourceStore.addTagToResource(tagId, resourceStore.currentId!)
  } else {
    ownSelectedTags.value.push(tagId)
  }
  emit("change", selectedTags.value)
}
const removeTag = (tagId: number) => {
  if (props.source === "CurrentResource") {
    resourceStore.removeTagFromResource(tagId, resourceStore.currentId!)
  } else {
    ownSelectedTags.value = ownSelectedTags.value.filter((tag) => tag !== tagId)
  }
  emit("change", selectedTags.value)
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
