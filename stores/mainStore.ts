import { defineStore } from "pinia"

export const useMainStore = defineStore('main', {
    state: () => ({
        version: "",
    }),
    actions: {
        async refreshVersion() {
            const { data, error } = await useApiGet<{ version: string }>("version")
            if (!error.value) {
                this.version = data.value.version
            }
        },
    },
})
