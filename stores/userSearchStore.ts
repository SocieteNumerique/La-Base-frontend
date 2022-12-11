import { defineStore } from "pinia"
import { useApiDelete, useApiGet, useApiPost } from "~/composables/api"
import { UserSearch } from "~/composables/types"

export const useUserSearchStore = defineStore("userSearch", () => {
  const userSearchById = ref<{ [id: number]: UserSearch }>({})

  const addUserSearch = async (
    query: string,
    name: string,
    dataType: "resources" | "bases"
  ) => {
    const { data, error } = await useApiPost<UserSearch>(
      `user_searches/`,
      { query, name, dataType },
      {},
      "La recherche a bien été créée",
      true
    )
    if (!error.value) {
      const userSearch = data.value!
      userSearchById.value[userSearch.id] = userSearch
    }

    return { data, error }
  }

  const deleteUserSearch = async (id: number) => {
    const { error } = await useApiDelete(
      `user_searches/${id}/`,
      {},
      "La recherche a bien été supprimée",
      true
    )
    if (!error.value) {
      delete userSearchById.value[id]
    }
  }

  const getUserSearches = async () => {
    const { data, error } = await useApiGet<UserSearch[]>("user_searches/")
    if (!error.value && data.value!) {
      for (const user_search of data.value!) {
        userSearchById.value[user_search.id] = user_search
      }
    }
  }

  const nSearches = computed(() => Object.keys(userSearchById).length)
  const searchesForDataType = computed(
    () => (dataType: "resources" | "bases") => {
      console.log(
        "### searchesForDataType",
        Object.values(userSearchById.value)
      )
      return Object.values(userSearchById.value).filter(
        (search) => search.dataType === dataType
      )
    }
  )

  return {
    addUserSearch,
    deleteUserSearch,
    getUserSearches,
    nSearches,
    searchesForDataType,
    userSearchById,
  }
})
