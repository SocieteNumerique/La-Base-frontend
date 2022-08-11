<template>
  <div class="fr-table fr-table--bordered">
    <table>
      <tbody>
        <tr v-for="({ label, tags, specific }, id) in tagsByCategory" :key="id">
          <th>
            <span>{{ label }}</span>
          </th>
          <td v-if="!specific"><DsfrTags :tags="tags" /></td>
          <td v-else-if="id === 'license'">
            <TagDisplayRowLicense
              :tags="tags"
              :license-text="element?.licenseText"
            />
          </td>
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
  tagCategories: {
    type: Array as PropType<TagCategory[]>,
    default: () => [...useTagStore().categories],
  },
  element: { type: Object as PropType<Resource>, required: true },
})

function getLabelAndId(category: TagCategory) {
  if (["license_01license", "license_02free"].includes(category.slug))
    return { label: "Licence", id: "license", specific: true }
  if (["license_04access", "license_00price"].includes(category.slug))
    return { label: "Prix et accès", id: "accessPrice", specific: false }
  return { label: category.name, id: category.id, specific: false }
}

type GroupedDisplayTags = {
  [key: number | string]: {
    label: string
    specific?: boolean
    tags: { label: string }[]
  }
}
const tagsByCategory = computed<GroupedDisplayTags>(() => {
  const res: GroupedDisplayTags = {}
  const tags = props.element
    .tags!.map((tagId) => tagStore.tagsById[tagId])
    .filter((tag) => tag !== undefined)
  for (const tag of tags) {
    const { label, id, specific } = getLabelAndId(
      tagStore.tagCategoriesById[tag.category]
    )
    if (!(id in res)) res[id] = { label, specific, tags: [] }
    res[id].tags.push({ label: tag.name })
  }
  return res
})
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

td > *
  margin-bottom: -0.5rem
</style>
