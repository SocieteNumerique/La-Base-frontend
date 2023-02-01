<template>
  <button
    class="user-search-tag fr-ml-2w fr-mt-2w"
    :class="active ? 'active' : null"
    :title="title"
    style="font-weight: 500"
    @click="selectSearch"
  >
    {{ userSearch?.name }}
    <VIcon
      name="ri-delete-bin-line"
      class="fr-ml-2w"
      style="color: var(--text-action-high-blue-france)"
      scale="0.75"
      @click.stop="deleteSearch"
    />
  </button>
</template>

<script setup lang="ts">
import { useUserSearchStore } from "~/stores/userSearchStore"
import { computed } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { useConfirm } from "~/composables/useConfirm"
import { doNothing } from "~/composables/utils"

const props = defineProps({
  active: { type: Boolean, default: false },
  id: { type: Number, required: true },
})
const emit = defineEmits(["select"])
const confirm = useConfirm()

const userSearchStore = useUserSearchStore()
const tagStore = useTagStore()
const userSearch = computed(() => {
  return userSearchStore.userSearchById[props.id]
})
const deleteSearch = () => {
  confirm(
    `Vous êtes sur le point de supprimer votre recherche enregistrée ${userSearch.value?.name}. Êtes-vous sûr ? Cette action est irréversible.`,
    `Supprimer ${userSearch.value?.name} ?`,
    "Oui",
    () => userSearchStore.deleteUserSearch(props.id),
    doNothing
  )
}
const selectSearch = () => {
  emit("select")
}
const title = computed(() => {
  const elements: string[] = []
  if (userSearch.value.query.text) {
    elements.push(`texte : ${userSearch.value.query.text}`)
  }
  if (userSearch.value.query.tags.length) {
    const showTags = userSearch.value.query.tags
      .map((tagId: number) => tagStore.tagsById[tagId].name)
      .join(", ")
    elements.push(`tags: ${showTags}`)
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
