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
            // $fetch<User>(BASE_URL + '/api/auth/login', { method: 'POST', body: , credentials: 'include' }).then((data) => {
            //     console.log("### login done", data)
            //     this.updateState(data)
            //     const router = useRouter()
            //     router.push("/profile")
            // }, () => {
            //     console.log("### login error")
            // })
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
