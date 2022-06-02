import { NuxtApp } from "nuxt3/dist/app/nuxt"
import { useLoadingStore } from "~/stores/loadingStore"
import { Alert } from "~/composables/types"
import { useAlertStore } from "~/stores/alertStore"

let base_url = ""
type MyHeaders = { [key: string]: string }

// local
if (process.env.NODE_ENV !== "production") {
  base_url = "http://localhost:8000"
} else {
  // production server
  if (process.server) {
    // server-side rendering
    base_url = "http://localhost:8000"
  }
}

const makeLoadingKey = (path: string) => {
  // camel-case the path : auth/login -> authLogin
  if (path.endsWith("/")) {
    path = path.slice(0, -1)
  }
  if (path.startsWith("/")) {
    path = path.slice(1)
  }
  let words = path.split("/")
  words = words.filter((word) => !/^\d+$/.test(word))
  for (const [ix, word] of Object.entries(words.slice(1))) {
    const newWord = word[0].toUpperCase() + word.slice(1)
    words[parseInt(ix) + 1] = newWord
  }
  return words.join("")
}

const getCsrfCookie = (ctx: NuxtApp) => {
  let cookie = ""
  if (ctx?.ssrContext?.req.headers.cookie) {
    cookie = ctx?.ssrContext.req.headers.cookie
  } else if (process.client) {
    cookie = document.cookie
  }
  if (!cookie) {
    return null
  }
  const csrfRow = cookie.split("; ").find((row) => row.startsWith("csrftoken="))
  if (!csrfRow) {
    return null
  }
  return csrfRow.split("=")[1]
}

const getHeaders = (ctx: NuxtApp, includeCsrf = false): MyHeaders => {
  const headers: MyHeaders = useRequestHeaders(["cookie"])
  if (includeCsrf) {
    const csrfToken = getCsrfCookie(ctx)
    if (csrfToken) {
      headers["X-CSRFTOKEN"] = csrfToken
    }
  }
  return headers
}

export const BASE_URL = base_url

export async function useApiRequest<Type>(
  method: string,
  path: string,
  payload: any,
  params = {},
  onSuccess: Alert | null = null,
  // if onError is true, the alert title and message is built from API response
  onError: Alert | boolean = false
) {
  const loadingStore = useLoadingStore()
  const alertStore = useAlertStore()

  const key = makeLoadingKey(path)
  loadingStore.markLoading(key)
  const { data, error } = await useAsyncData<Type>(key, (ctx) =>
    $fetch(BASE_URL + "/api/" + path, {
      method: method,
      body: payload,
      credentials: "include",
      headers: getHeaders(ctx!, method != "GET"),
      params: params,
    })
  )

  // handle alerts and loading status
  if (error.value) {
    loadingStore.markError(key)
    if (onError === true) {
      alertStore.alert(
        "Erreur lors de la requête",
        `${error.value.message} : ${JSON.stringify(error.value.data)}`,
        "error"
      )
    } else if (onError) {
      alertStore.alert(onError.title, onError.text, "error")
    }
  } else {
    loadingStore.markDone(key)
    if (onSuccess) {
      alertStore.alert(onSuccess.title, onSuccess.text, "success")
    }
  }
  return { data, error }
}

export async function useApiGet<Type>(
  path: string,
  params = {},
  onSuccess: Alert | null = null,
  onError: Alert | boolean = false
) {
  return useApiRequest<Type>("GET", path, undefined, params, onSuccess, onError)
}

export async function useApiPost<Type>(
  path: string,
  payload = {},
  params = {},
  onSuccess: Alert | null = null,
  onError: Alert | boolean = false
) {
  return useApiRequest<Type>("POST", path, payload, params, onSuccess, onError)
}

export async function useApiPatch<Type>(
  path: string,
  payload = {},
  params = {},
  onSuccess: Alert | null = null,
  onError: Alert | boolean = false
) {
  return useApiRequest<Type>("PATCH", path, payload, params, onSuccess, onError)
}

export async function useApiDelete<Type>(
  path: string,
  params = {},
  onSuccess: Alert | null = null,
  onError: Alert | boolean = false
) {
  return useApiRequest<Type>(
    "DELETE",
    path,
    undefined,
    params,
    onSuccess,
    onError
  )
}
