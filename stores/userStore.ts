import { defineStore } from "pinia"

// const { data } = await useFetch<{ username: string, email: string }>('/api/auth/profile')

type user = { email: string, username: string }

export const useUserStore = defineStore('user', {
    state: () => ({
        username: "",
        email: "",
    }),
    actions: {
        // login(email, password) {
        // loginUser({email, password}).then((data) => {
        //     this.updateState(data)
        // })
        // },
        refreshProfile() {
            $fetch<user>(BASE_URL + '/api/auth/profile').then((data) => {
                console.log("### refreshprofile", data)
                this.updateState(data)
            }, () => {
                console.log("### refreshprofile error")
                this.updateState({ email: "", username: "" })
            })
        },
        updateState(data: user) {
            console.log("### update state", data)
            this.username = data.username
            this.email = data.email
        }
    },
})
