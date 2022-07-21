<template>
  <div
    :id="'tag-radio-selector-' + props.category.id"
    class="tag-radio-selector"
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
      <DsfrRadioButtonSet
        v-model="selectedValue"
        :name="'tag-radio-group-' + props.category.id"
        :options="tagOptions"
        inline
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tag, TagCategory } from "~/composables/types"
import { computed, PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { useResourceStore } from "~/stores/resourceStore"

const tagStore = useTagStore()
const resourceStore = useResourceStore()

const selectedValue = computed<number | undefined>({
  get: () =>
    sourceTags.value?.length
      ? sourceTags.value?.find((id) => props.category.tags.includes(id))
      : undefined,
  set(value: number | undefined) {
    chooseTag(value)
  },
})
const emit = defineEmits(["select", "change"])

const props = defineProps({
  category: {
    type: Object as PropType<TagCategory>,
    required: true,
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

const tagOptions = computed(() => {
  return props.category?.tags.map((tagId: number) => {
    const tag = tagStore.tagsById[tagId]
    return {
      label: tag.name,
      value: tag.id,
      hint: tag.definition,
    }
  })
})

function chooseTag(tagId?: number) {
  if (props.source === "CurrentResource") {
    resourceStore.setTagOfCategory(
      tagId,
      props.category.id,
      resourceStore.currentId!
    )
  } else {
    ownSelectedTags.value = tagStore.setTagOfCategory(
      tagId,
      props.category.id,
      ownSelectedTags.value
    )
  }
  emit(
    "change",
    props.source === "ownId" ? sourceTags.value : selectedTags.value
  )
}
</script>
