import { useResourceStore } from "~/stores/resourceStore"
import { useAlertStore } from "~/stores/alertStore"
import { useRoute } from "vue-router"
import { useUserStore } from "~/stores/userStore"

export const getResourceIfNotExists = async () => {
  const resourceStore = useResourceStore()
  const route = useRoute()
  const router = useRouter()
  const alertStore = useAlertStore()

  // @ts-ignore
  const resourceId = parseInt(route.params.id)
  resourceStore.setCurrentId(resourceId)
  if (
    !resourceStore.resourcesById[resourceId] ||
    resourceStore.resourcesById[resourceId].isShort
  ) {
    const resource = await resourceStore.getResource(resourceId)

    // no redirection and alerts on the server
    if (process.server) {
      return
    }

    if (resource == null) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        alertStore.alert(
          "Veuillez vous connecter pour avoir accès à cette ressource",
          "",
          "warning"
        )
        router.push({ path: "/connexion", query: { next: route.path } })
      } else {
        alertStore.alert(
          "Impossible d'accéder à la ressource demandée",
          "Vous n'y avez peut-être pas accès",
          "warning"
        )
        router.push("/")
      }
    }

    return false
  }
  return true
}
