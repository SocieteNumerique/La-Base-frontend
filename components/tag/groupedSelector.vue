<template>
  <TagSearchSelector
    :category="category"
    :is-focused="isFocused"
    :source="source"
    :init-tags="initTags"
    :label="label"
    :mode="mode"
  >
    <template #tag-lines="{ onSelect, filteredTags }">
      <template
        v-for="(tagsOfGroup, group) in filteredTagsByGroup(filteredTags)"
        :key="group"
      >
        <div class="result-line fr-mt-3v">
          <div class="tag-line fr-py-1w">
            <p class="fr-m-0 fr-text--bold fr-text--sm" :title="group">
              {{ group }}
            </p>
          </div>
        </div>
        <TagLine
          v-for="tag in tagsOfGroup"
          :key="tag.id"
          :tag="tag"
          @select="onSelect(tag.id)"
        />
      </template>
      <div />
    </template>
  </TagSearchSelector>
</template>

<script setup lang="ts">
import { Tag, TagCategory } from "~/composables/types"
import { PropType } from "vue"

function filteredTagsByGroup(tags: Tag[]): { [group: string]: Tag[] } {
  const res: { [group: string]: Tag[] } = {}
  let categories
  for (const tag of tags) {
    categories = tag.slug?.split("_")[0].split(",") || ["Non classé"]
    for (const category of categories) {
      if (!Object.hasOwn(res, category)) res[category] = []
      res[category].push(tag)
    }
  }
  return res
}

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
</script>
