import { useUserStore } from "~/stores/userStore"

export default defineNuxtRouteMiddleware((to, from) => {
  if (
    !process.server &&
    from.name === "index" &&
    window.history.state.position === 1 &&
    useUserStore().isLoggedIn
  ) {
    return navigateTo("/recherche")
  }
})
