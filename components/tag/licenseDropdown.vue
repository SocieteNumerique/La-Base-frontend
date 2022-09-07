<template>
  <TagDropdown
    :category="licenseTypeCategory"
    :is-focused="isFocused"
    :selected-tags="selectedTags"
    :enabled-tags="enabledTags"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @select="$emit('select', $event)"
  >
    <template #label>Licence</template>
    <template #tag-lines="{ isTagEnabled }">
      <template v-if="isFocused">
        <TagLine
          :tag="licenseTypePossibleTagsByKey['proprietary']"
          :disabled="
            !isTagEnabled(licenseTypePossibleTagsByKey['proprietary'].id)
          "
          @select="
            $emit('select', licenseTypePossibleTagsByKey['proprietary'].id)
          "
        />
        <TagLine
          :tag="licenseTypePossibleTagsByKey['other']"
          :disabled="!isTagEnabled(licenseTypePossibleTagsByKey['other'].id)"
          @select="$emit('select', licenseTypePossibleTagsByKey['other'].id)"
        />
        <TagLine
          :tag="licenseTypePossibleTagsByKey['free']"
          :disabled="!isTagEnabled(licenseTypePossibleTagsByKey['free'].id)"
          class="result-line-free"
          @select="$emit('select', licenseTypePossibleTagsByKey['free'].id)"
        />

        <div class="result-line">
          <div class="tag-line fr-py-1w">
            <div
              class="cursor--pointer dropdown-title fr-text-label--blue-france"
              @click="showDetailedList = !showDetailedList"
            >
              Licences libres détaillées
              <VIcon name="ri-arrow-down-s-line" />
            </div>
          </div>
        </div>

        <template v-if="showDetailedList">
          <template
            v-for="(tagsOfGroup, group) in tagStore.groupTags(
              freeLicensePossibleTags
            )"
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
              :disabled="!isTagEnabled(tag.id)"
              @select="$emit('select', tag.id)"
            />
          </template>
        </template>
        <div />
      </template>
    </template>
  </TagDropdown>
</template>

<script setup lang="ts">
import { Tag } from "~/composables/types"
import { PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"

const tagStore = useTagStore()

defineEmits(["focus", "blur", "select", "change"])
const props = defineProps({
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
  tagOperator: {
    type: String as PropType<"AND" | "OR">,
    required: true,
  },
})

const licenseTypeCategory = tagStore.categoryBySlug("license_01license")
const freeLicenseCategory = tagStore.categoryBySlug("license_02free")

const showDetailedList = ref<boolean>(false)

type TagByKey = { [key: string]: Tag }
const licenseTypePossibleTagsByKey = computed<TagByKey>(
  () =>
    licenseTypeCategory?.tags
      .filter((tag) => props.selectedTags.indexOf(tag) === -1)
      .map((tagId) => tagStore.tagsById[tagId])
      .reduce((tagsBySlug: TagByKey, tag: Tag) => {
        if (!tag.slug || !licenseTagBySlug[tag.slug]) return tagsBySlug
        tagsBySlug[licenseTagBySlug[tag.slug]] = tag
        return tagsBySlug
      }, {}) || {}
)

const freeLicensePossibleTags = computed<Tag[]>(
  () =>
    freeLicenseCategory?.tags
      .filter((tag) => props.selectedTags.indexOf(tag) === -1)
      .map((tagId) => tagStore.tagsById[tagId]) || []
)
</script>

<style lang="sass" scoped>
.result-line-free
  border-bottom: none
</style>
