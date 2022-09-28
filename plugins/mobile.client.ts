import { useRouter } from "vue-router"
import { mobileOrTabletCheck } from "~/composables/mobileCheck"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    if (mobileOrTabletCheck()) {
      const router = useRouter()
      setTimeout(() => router.replace("/mobile"), 200)
    }
  })
})
