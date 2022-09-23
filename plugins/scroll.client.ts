import { LocationQuery } from "vue-router"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.options.scrollBehavior = (
    to: LocationQuery,
    from: LocationQuery
  ) => {
    if (to.path == from.path) {
      return
    }
    return { left: 0, top: 0 }
  }
})
