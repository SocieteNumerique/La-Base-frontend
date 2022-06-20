<template>
  <div :id="id">
    <label class="fr-label" for="user-selector">{{ props.label }}</label>
    <div class="fr-search-bar fr-input-group fr-mb-0">
      <input
        id="user-selector"
        v-model="textInput"
        class="fr-input"
        type="text"
        @input="onInput"
        @focus="isFocused = true"
      />
      <button class="fr-btn">
        <VIcon name="ri-search-line" />
      </button>
    </div>

    <!-- search results -->
    <div class="result-line-holder">
      <div v-if="textInput && !results.length && !loading" class="fr-my-3v">
        Aucun résultat correspondant
      </div>

      <ul v-else-if="isFocused" class="result-list fr-text--xs">
        <li
          v-for="user of results"
          :key="user.id"
          class="item has-children-space-between"
        >
          <div>{{ user.firstName }} {{ user.lastName }}</div>
          <button
            class="fr-btn fr-btn--sm fr-btn--secondary fr-text-title--blue-france action"
            @click="selectUser(user)"
          >
            Ajouter
          </button>
        </li>
      </ul>
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
  id: { type: String, default: "user-selector-container" },
})

const textInput = ref("")
const loading = ref<boolean>(false)
const results = ref<User[]>([])
const isFocused = ref<boolean>(false)
defineEmits(["update:modelValue"])
const multi = computed<boolean>(() => props.nbMaximumUsers != 1)

const selectedUsers = useModel<User[]>("modelValue", {
  type: "array",
})
// const selectedUsers = ref<User[]>([])

const onInput = debounce(async () => {
  if (!textInput.value) {
    return
  }
  loading.value = true
  let endpoint = `search/`
  const { data, error } = await useApiPost<UsersSearchResult>(
    endpoint,
    {
      text: textInput.value,
      dataType: "users",
    },
    { page: 1, page_size: 100 }
  )
  if (!error.value) {
    // filter out already selected users
    const selectedUserIds = selectedUsers.value.map((user) => user.id)
    results.value = data.value.results.objects.filter(
      (user: User) => !selectedUserIds.includes(user.id)
    )
  }
  loading.value = false
}, 200)

const removeUserId = (userId: number) => {
  selectedUsers.value = selectedUsers.value.filter(
    (user: User) => user.id !== userId
  )
}

const selectUser = (user: User) => {
  if (!user.id) return
  removeUserId(user.id) // make sure there are no duplicates
  selectedUsers.value = [
    ...selectedUsers.value.filter((user_) => user_.id !== user.id),
    user,
  ]
  if (!multi.value) {
    textInput.value = ""
    results.value = []
  }
}

onFocusOut(
  () => (isFocused.value = false),
  props.id,
  () => isFocused.value
)
</script>

<style lang="sass" scoped>
.result-list
  --item-height: 44px
  border: 1px solid var(--border-default-grey)
  max-height: calc(5 * var(--item-height))
  padding: 0
  overflow-y: scroll

.item
  border-bottom: 1px solid var(--border-default-grey)
  padding: 12px
  display: flex
  align-items: center
  width: 100%
  height: var(--item-height)

  .action
    display: none
    margin-left: auto

  &:hover .action
    display: block
</style>
