import { defineStore } from "pinia"
import { User } from "~/composables/types"
import { useBaseStore } from "~/stores/baseStore"

export const useUserStore = defineStore("user", {
  state: () => ({
    email: "",
    id: 0,
    username: "",
  }),
  actions: {
    async login(email: string, password: string) {
      const { data, error } = await useApiPost<User>("auth/login", {
        email,
        password,
      })
      if (!error.value) {
        this.updateState(data.value)
        const router = useRouter()

        const baseStore = useBaseStore()
        await baseStore.refreshBases()
        router.push("/profile")
      }
    },
    async logout() {
      const { data, error } = await useApiPost<User>("auth/logout")
      if (!error.value) {
        this.updateState({ id: 0, username: "", email: "" })
        const router = useRouter()
        router.push("/login")
      }
    },
    async refreshProfile() {
      const { data, error } = await useApiGet<User>("auth/profile")
      if (!error.value) {
        this.updateState(data.value)
      }
    },
    updateState(data: User) {
      this.username = data.username
      this.email = data.email
    },
  },
})
