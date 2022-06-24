<template>
  <div class="fr-table fr-table--bordered">
    <table>
      <tbody>
        <tr v-for="category in props.tagCategories" :key="category.id">
          <th>{{ category.name }}</th>
          <td><DsfrTags :tags="tagsForCategory(category, props.element)" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
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
    console.log("### tagsforcategory", element)
    return element
      .tags!.map((tagId) => tagStore.tagsById[tagId])
      .filter((tag) => tag?.category === category.id)
      .map((tag) => ({ label: tag.name }))
  }
)
</script>

<style scoped>
th,
td,
tr,
tbody {
  background: none !important;
}
th,
td {
  padding: 10px;
}
</style>
