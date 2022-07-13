<template>
  <div class="fr-table fr-table--bordered">
    <table>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <th>
            <span>{{ category.name }}</span>
          </th>
          <td><DsfrTags :tags="tagsForCategory(category, props.element)" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue"
import { Resource, TagCategory } from "~/composables/types"
import { DsfrTags } from "@laruiss/vue-dsfr"
import { useTagStore } from "~/stores/tagStore"

const tagStore = useTagStore()

const props = defineProps({
  tagCategories: { type: Array as PropType<TagCategory[]>, required: true },
  element: { type: Object as PropType<Resource>, required: true },
})

const tagsForCategory = computed(
  () => (category: TagCategory, element: Resource) => {
    return element
      .tags!.map((tagId) => tagStore.tagsById[tagId])
      .filter((tag) => tag?.category === category.id)
      .map((tag) => ({ label: tag.name }))
  }
)

const categories = computed(() =>
  props.tagCategories.filter(
    (category) => tagsForCategory.value(category, props.element).length
  )
)
</script>

<style scoped lang="sass">
th, td, tr, tbody
  background: none !important

th, td
  padding: 10px

th
  vertical-align: top
  span
    display: inline-block
    padding: 4px 0

tr
  // safari display
  position: relative
  &:not(:first-child)::after
    content: ""
    width: 100%
    height: 1px
    background: var(--border-default-grey)
    display: block
    position: absolute
    left: 0
</style>
