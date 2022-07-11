<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    title="Le statut en consultation de la base"
    @close="$emit('close')"
  >
    <p>
      Paramétrer les droits de consultation de votre base<br />
      Vous pouvez modifier ces droits à tout moment.
    </p>
    <DsfrRadioButtonSet
      v-model="baseState"
      :inline="true"
      :options="options"
      :required="true"
      legend="Le statut de la base est"
      name="baseState"
      class="fr-mt-3w"
    />
    <p>{{ stateHint }}</p>

    <div v-if="baseState === 'private'" class="fr-mb-4w">
      <UserSelector
        v-model="authorizedUsers"
        label="Autoriser uniquement ces utilisateurs à consulter cette base"
      />
      <UserList :users="authorizedUsers" @remove="removeUserId" />

      <TagSelector
        v-if="tagStore.categoryBySlug(participantTypeCategoryName)"
        :category="tagStore.categoryBySlug(participantTypeCategoryName)"
        :init-tags="baseStore.current.authorizedUserTags"
        :is-focused="focusedInput === 'tags'"
        label="Autoriser pour une typologie d’acteurs"
        source="own"
        mode="filter"
        @blur="focusedInput = undefined"
        @change="authorizedUserTags = $event"
        @focus="focusedInput = 'tags'"
      />
    </div>
  </DsfrModal>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useBaseStore } from "~/stores/baseStore"
import { useTagStore } from "~/stores/tagStore"
import { participantTypeCategoryName } from "~/composables/strUtils"
import { Tag, User } from "~/composables/types"

const emits = defineEmits(["close", "save"])
const tagStore = useTagStore()
const baseStore = useBaseStore()
const baseState = ref<string>(baseStore.current.state || "private")

const focusedInput = ref<"tag" | "user" | undefined>()
const authorizedUsers = ref<User[]>(baseStore.current.authorizedUsers || [])
const authorizedUserTags = ref<Tag[]>(
  (baseStore.current.authorizedUserTags || [])?.map(
    (id: number) => tagStore.tagsById[id]
  ) || []
)
const removeUserId = (userId: number) => {
  authorizedUsers.value = authorizedUsers.value.filter(
    (user: User) => user.id !== userId
  )
}

const hintByState: { [key: string]: string } = {
  public:
    "Cette base peut être consultée par tous les visiteurs, qu’ils disposent ou non d’un compte utilisateur. Elle ne peut cependant être modifiée que par les administrateurs et contributeurs.",
  private:
    "Cette base n’est accessible qu’aux administrateurs et contributeurs de votre base, ainsi qu’à un nombre réduit d’autres utilisateurs, sélectionnés par vous.",
  draft:
    "Cette base  n’est visible dans le moteur de recherche que par les administrateurs et contributeurs de votre base, ainsi qu’à un nombre réduit d’autres utilisateurs, sélectionnés par vous.",
}
const stateHint = computed<string>(() => hintByState[baseState.value] || "")

const options = [
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Privé",
    value: "private",
  },
  /* {
    label: "Invisible",
    value: "draft",
  },*/
]

const actions = computed(() => [
  {
    label: "Valider",
    onClick: async () =>
      emits("save", {
        id: baseStore.currentId!,
        state: baseState.value,
        authorizedUserTags: authorizedUserTags.value.map((tag) => tag.id),
        authorizedUsers: authorizedUsers.value,
      }),
    disabled: !baseState.value,
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

<style lang="sass" scoped></style>
