import { defineStore } from "pinia"
import { useApiDelete, useApiGet, useApiPost } from "~/composables/api"
import { UserSearch, UserSearchQuery } from "~/composables/types"

type UserStoreState = {
  userSearchById: { [id: number]: UserSearch }
}

export const useUserSearchStore = defineStore("userSearch", {
  state: (): UserStoreState => ({
    userSearchById: {},
  }),
  getters: {
    nSearches: (state) => {
      return Object.keys(state.userSearchById).length
    },
    searchesForDataType: (state) => {
      return (dataType: "resources" | "bases") => {
        return Object.values(state.userSearchById).filter(
          (search: UserSearch) => search.dataType === dataType
        )
      }
    },
  },
  actions: {
    async addUserSearch(
      query: UserSearchQuery,
      name: string,
      dataType: "resources" | "bases"
    ) {
      const { data, error } = await useApiPost<UserSearch>(
        `user_searches/`,
        { query, name, dataType },
        {},
        "La recherche a bien été créée",
        true
      )
      if (!error.value) {
        const userSearch = data.value!
        this.userSearchById[userSearch.id] = userSearch
      }

      return { data, error }
    },
    async deleteUserSearch(id: number) {
      const { error } = await useApiDelete(
        `user_searches/${id}/`,
        {},
        "La recherche a bien été supprimée",
        true
      )
      if (!error.value) {
        delete this.userSearchById[id]
      }
    },
    async getUserSearches() {
      const { data, error } = await useApiGet<UserSearch[]>("user_searches/")
      if (!error.value && data.value!) {
        for (const user_search of data.value!) {
          this.userSearchById[user_search.id] = user_search
        }
      }
    },
  },
})
