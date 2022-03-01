import { defineStore } from "pinia"
import { User } from "~/composables/types"

export const useUserStore = defineStore('user', {
    state: () => ({
        username: "",
        email: "",
    }),
    actions: {
        async login(email: string, password: string) {
            const { data, error } = await useApiPost<User>("auth/login", { email, password })
            if (!error.value) {
                this.updateState(data.value)
                const router = useRouter()
                router.push("/profile")
            }
        },
        async logout() {
            const { data, error } = await useApiPost<User>("auth/logout")
            if (!error.value) {
                this.updateState({ username: "", email: "" })
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
        }
    },
})
