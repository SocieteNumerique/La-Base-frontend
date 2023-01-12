import { useUserStore } from "~/stores/userStore"

export default defineNuxtRouteMiddleware((to, from) => {
  // on load, redirect to Search page if user is already
  // logged in and on index page
  if (
    process.client &&
    from.name === "index" &&
    to.name === "index" &&
    useUserStore().isLoggedIn
  ) {
    return navigateTo("/recherche")
  }
})
