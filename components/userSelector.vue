<template>
  <div>
    <label class="fr-label" for="user-selector">{{ props.label }}</label>
    <div class="fr-search-bar fr-input-group fr-mb-0">
      <input
        id="user-selector"
        v-model="textInput"
        class="fr-input"
        type="text"
        @input="onInput"
      />
      <button class="fr-btn">
        <VIcon name="ri-search-line" />
      </button>
    </div>

    <!-- selected users -->
    <ul v-if="selectedUsers?.length" class="fr-px-2w fr-pt-1w fr-tags-group">
      <li v-for="user in selectedUsers" :key="user.id">
        <button class="fr-tag" @click="removeUser(user.id)">
          {{ user.firstName }} {{ user.lastName }}
          <VIcon name="ri-close-line" />
        </button>
      </li>
    </ul>

    <!-- search results -->
    <div class="result-line-holder">
      <div v-if="textInput && results.length === 0">
        Aucun résultat correspondant
      </div>
      <div v-for="user of results" :key="user.id" class="result-line">
        <div>
          <span class="cursor--pointer" @click="selectUser(user)">
            {{ user.firstName }} {{ user.lastName }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useApiPost } from "~/composables/api"
import { User, UsersSearchResult } from "~/composables/types"
import { PropType } from "vue"

const props = defineProps({
  modelValue: { type: Array as PropType<User[]>, default: () => [] },
  label: { type: String, default: () => "Choisissez un utilisateur" },
  nbMaximumUsers: { type: Number, default: () => 1 },
})

const textInput = ref("")
const results = ref<User[]>([])
const emit = defineEmits(["update:modelValue"])

const selectedUsers = useModel<User[]>("modelValue", {
  type: "array",
})
// const selectedUsers = ref<User[]>([])

const onInput = debounce(async () => {
  if (!textInput.value) {
    return
  }
  let endpoint = `search/users`
  const { data, error } = await useApiPost<UsersSearchResult>(endpoint, {
    text: textInput.value,
  })
  if (!error.value) {
    // filter out already selected users
    const selectedUserIds = selectedUsers.value.map((user) => user.id)
    results.value = data.value.objects.filter(
      (user: User) => selectedUserIds.indexOf(user.id) === -1
    )
  }
}, 200)

const removeUser = (userId: number) => {
  selectedUsers.value = selectedUsers.value.filter(
    (user: User) => user.id !== userId
  )
}
const selectUser = (user: User) => {
  removeUser(user.id) // make sure there are no duplicates
  selectedUsers.value = [
    ...selectedUsers.value.filter((user_) => user_.id !== user.id),
    user,
  ]
  textInput.value = ""
  results.value = []
}
</script>
