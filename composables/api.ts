import { NuxtApp } from "nuxt3/dist/app/nuxt"
import { useLoadingStore } from "~/stores/loadingStore"

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
  params = {}
) {
  const loadingStore = useLoadingStore()

  const key = makeLoadingKey(path)
  loadingStore.markLoading(key)
  const { data, error } = await useAsyncData<Type>(key, (ctx) =>
    $fetch(BASE_URL + "/api/" + path, {
      method: method,
      body: payload,
      credentials: "include",
      headers: getHeaders(ctx!, true),
      params: params,
    })
  )
  console.log(`### api ${method} results`, key, data.value, error.value)
  if (error.value) {
    loadingStore.markError(key)
  } else {
    loadingStore.markDone(key)
  }
  return { data, error }
}

export async function useApiGet<Type>(path: string, params = {}) {
  return useApiRequest<Type>("GET", path, undefined, params)
}

export async function useApiPost<Type>(
  path: string,
  payload = {},
  params = {}
) {
  return useApiRequest<Type>("POST", path, payload, params)
}

export async function useApiPatch<Type>(
  path: string,
  payload = {},
  params = {}
) {
  return useApiRequest<Type>("PATCH", path, payload, params)
}

export async function useApiDelete<Type>(path: string, params = {}) {
  return useApiRequest<Type>("DELETE", path, undefined, params)
}
