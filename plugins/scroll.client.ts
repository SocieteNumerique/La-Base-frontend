import { LocationQuery } from "vue-router"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.options.scrollBehavior = (
    to: LocationQuery,
    from: LocationQuery
  ) => {
    console.log("### to", to.name, to.path, "from", from.name, from.path)
    if (to.path == from.path) {
      return
    }
    return { left: 0, top: 0 }
  }
})
