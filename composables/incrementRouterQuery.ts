import { useRoute, useRouter } from "vue-router"

export const useIncrementRouterQuery = () => {
  const route = useRoute()
  const router = useRouter()
  const number = ref(0)

  return () => {
    number.value = number.value + 1
    setTimeout(
      () => router.push({ query: { ...route.query, i: number.value } }),
      200
    )
  }
}
