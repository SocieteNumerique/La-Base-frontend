<template>
  <DsfrModal
    :actions="addActions"
    opened
    title="Contributeurs de la base"
    @close="$emit('close')"
  >
    <UserSelector
      v-model="contributors"
      label="Ajouter un contributeur en cherchant dans les utilisateurs"
    />
    <UserList :users="contributors" @remove="removeUserId" />

    <TagSelector
      v-if="tagStore.categoryBySlug(participantTypeCategoryName)"
      :category="tagStore.categoryBySlug(participantTypeCategoryName)"
      :init-tags="baseStore.current.contributorTags"
      :is-focused="focusedInput === 'tags'"
      label="Ajouter des contributeurs par typologie d’acteurs"
      source="own"
      mode="filter"
      @blur="focusedInput = undefined"
      @change="contributorTags = $event"
      @focus="focusedInput = 'tags'"
    />
  </DsfrModal>
</template>

<script lang="ts" setup>
import { useBaseStore } from "~/stores/baseStore"
import { Tag, User } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"
import { participantTypeCategoryName } from "~/composables/strUtils"

const baseStore = useBaseStore()
const tagStore = useTagStore()

const emits = defineEmits(["close"])

const focusedInput = ref<"tag" | "user" | undefined>()

const contributors = ref<User[]>(baseStore.current.contributors || [])
const contributorTags = ref<Tag[]>(
  (baseStore.current.contributorTags || [])?.map(
    (id: number) => tagStore.tagsById[id]
  ) || []
)

const removeUserId = (userId: number) => {
  contributors.value = contributors.value.filter(
    (user: User) => user.id !== userId
  )
}

const updateBase = () => {
  baseStore.update({
    ...baseStore.current,
    contributorTags: contributorTags.value.map((tag) => tag.id),
    contributors: contributors.value,
  })
}

const addActions = computed(() => [
  {
    label: "Valider",
    onClick: updateBase,
  },
  {
    label: "Annuler",
    secondary: true,
    onClick: () => {
      emits("close")
    },
  },
])
</script>
