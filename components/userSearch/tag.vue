<template>
  <button
    class="user-search-tag fr-ml-3v fr-mt-2w"
    :class="active ? 'active' : null"
    @click="selectSearch"
  >
    {{ userSearch?.name }}
    <VIcon
      name="ri-delete-bin-line"
      class="fr-ml-2w"
      style="color: var(--text-action-high-blue-france)"
      @click.stop="deleteSearch"
    />
  </button>
</template>

<script setup lang="ts">
import { useUserSearchStore } from "~/stores/userSearchStore"
import { computed, defineEmits } from "vue"
import { paramsFromQueryString } from "~/composables/utils"

const props = defineProps({
  active: { type: Boolean, default: false },
  id: { type: Number, required: true },
})
const emit = defineEmits(["select"])

const userSearchStore = useUserSearchStore()
const userSearch = computed(() => {
  return userSearchStore.userSearchById[props.id]
})
const deleteSearch = () => {
  userSearchStore.deleteUserSearch(props.id)
}
const selectSearch = () => {
  console.log("### select search !!")
  emit("select")
}
const title = computed(() => {
  const query: any = paramsFromQueryString(userSearch.value?.query)
  const elements: string[] = []
  if (query.text) {
    elements.push(`texte : ${query.text}`)
  }
  if (query.tags) {
    elements.push(`${query.tags.split(",").length} tags`)
  }
  return elements.join(" | ")
})
</script>

<style lang="sass">
.user-search-tag
  border-radius: 8px
  padding: 8px 16px
  background: white
  border: 1px solid var(--blue-france-925-125-hover)
.user-search-tag.active
  background: blue
  background: var(--blue-france-925-125)
</style>
