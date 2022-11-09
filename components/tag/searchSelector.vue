<template>
  <div
    :id="'tag-selector-' + props.category.id"
    class="fr-form-group tag-selector"
    :class="{ focused: isFocused }"
  >
    <div class="fr-input-group fr-mb-0">
      <label
        v-if="props.label !== null || props.category.name"
        class="fr-label search"
        :for="'category-input-' + props.category.id"
      >
        {{ props.label !== null ? props.label : props.category.name }}
        <span v-if="hintTextLines.length" class="fr-hint-text">
          <template v-for="line in hintTextLines" :key="line">
            {{ line }}
            <br />
          </template>
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
    <div class="tag-sub-input">
      <ul v-if="selectedTags.length" class="fr-px-2w fr-pt-1w fr-tags-group">
        <li v-for="tag in selectedTags" :key="tag.id">
          <button class="fr-tag" @click="removeTag(tag.id)">
            {{ tag.name }}
            <VIcon name="ri-close-line" />
          </button>
        </li>
      </ul>
      <div class="tag-line-container">
        <template v-if="isFocused">
          <slot
            name="tag-lines"
            :on-select="selectTag"
            :filtered-tags="filteredTags"
          >
            <TagLine
              v-for="tag in filteredTags"
              :key="tag.id"
              :tag="tag"
              @select="selectTag(tag.id)"
            />
          </slot>
        </template>
      </div>
      <div
        v-if="isFocused && props.category.acceptsFreeTags"
        class="fr-px-2w fr-py-1w"
        style="border-top: 1px solid var(--background-disabled-grey)"
      >
        <button
          class="fr-m-0 fr-text--md fr-text-label--blue-france"
          @click="onSuggestAddingTag"
        >
          <VIcon name="ri-add-circle-line" />
          Ajouter un nouveau tag
        </button>
      </div>
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
import { PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { useResourceStore } from "~/stores/resourceStore"
import { useAlertStore } from "~/stores/alertStore"

const tagStore = useTagStore()
const resourceStore = useResourceStore()
const alertStore = useAlertStore()

const inputValue = ref("")
const emit = defineEmits(["focus", "blur", "select", "change"])

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
    type: String as PropType<"CurrentResource" | "own" | "ownId">,
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
const ownSelectedTags = ref<number[]>([...props.initTags])

const hintTextLines = computed(() => {
  const toShow: string[] = []
  if (props.category.requiredToBePublic) {
    toShow.push("Requis")
  }
  if (props.category.maximumTagCount && props.mode === "set") {
    toShow.push(`${props.category.maximumTagCount} maximum`)
  }

  const lines = []
  if (toShow.length) {
    lines.push(toShow.join(", "))
  }
  if (props.category.description) {
    lines.push(props.category.description)
  }

  return lines
})

// detect clicks outside of tagSelector to blur it
const onClick = (ev: Event) => {
  if (!props.isFocused) {
    return
  }
  const container = document.getElementById("tag-selector-" + props.category.id)
  if (!container!.contains(ev!.target)) {
    emit("blur")
  }
}

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
  return props.category?.tags
    .filter((tagId: number) => sourceTags.value?.indexOf(tagId) !== -1)
    .map((tagId: number): Tag => tagStore.tagsById[tagId])
})

const possibleTags = computed(() => {
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
    props.mode === "set" &&
    selectedTags.value.length >= props.category.maximumTagCount
  ) {
    alertStore.alert(
      "Nombre maximum de tags",
      "Le nombre maximum de tag pour cette catégorie est de " +
        props.category.maximumTagCount,
      "warning"
    )
    return
  }

  let nTags: number
  if (props.source === "CurrentResource") {
    resourceStore.addTagToResource(tagId, resourceStore.currentId!)
    nTags = resourceStore.current.tags!.length
  } else {
    ownSelectedTags.value.push(tagId)
    nTags = ownSelectedTags.value.length
  }

  // if we've already select the maximum number of tags, close the menu
  if (nTags >= props.category.maximumTagCount && props.mode === "set") {
    emit("blur")
  }
  emit(
    "change",
    props.source === "ownId" ? sourceTags.value : selectedTags.value
  )
  inputValue.value = ""
}
const removeTag = (tagId: number) => {
  if (props.source === "CurrentResource") {
    resourceStore.removeTagFromResource(tagId, resourceStore.currentId!)
  } else {
    ownSelectedTags.value = ownSelectedTags.value.filter((tag) => tag !== tagId)
  }
  emit(
    "change",
    props.source === "ownId" ? sourceTags.value : selectedTags.value
  )
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

<style lang="sass" scoped>
.tag-sub-input
  overflow-x: hidden
  margin-bottom: -12px
  border: 1px solid transparent
  transition: border-color 0.4s ease-in-out 0s
  background-color: white

.fr-tags-group
  margin-left: -16px
  border-bottom: 1px solid transparent

.tag-line-container
  transition: max-height 0.4s ease-in-out 0s
  overflow-y: auto
  height: 100%
  max-height: 0

.tag-selector.focused
  .tag-sub-input, .fr-tags-group
    border-color: var(--grey-975-75-active)
  .tag-line-container
    max-height: 300px
</style>
