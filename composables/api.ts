import { NuxtApp } from "nuxt/dist/app/nuxt"
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
    const port = process.env.API_PORT || "8000"
    console.log("### api port", port)
    // server-side rendering
    base_url = `http://localhost:${port}`
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
  if (ctx.ssrContext?.req?.headers.cookie) {
    cookie = ctx?.ssrContext.req.headers.cookie
  } else if (process.client) {
    cookie = document.cookie
  }
  console.log("### getCsrfCookie", cookie)
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
  console.log("### get headers", headers, "includecsrf", includeCsrf)
  if (includeCsrf) {
    const csrfToken = getCsrfCookie(ctx)
    if (csrfToken) {
      headers["X-CSRFTOKEN"] = csrfToken
    }
  }
  return headers
}

export const BASE_URL = base_url

function makeId(length: number) {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export async function useApiRequest<Type>(
  method: string,
  path: string,
  payload: any,
  params = {},
  onSuccess: Alert | string | null = null,
  // if onError is true, the alert title and message is built from API response
  onError: Alert | string | boolean = false
) {
  const loadingStore = useLoadingStore()
  const alertStore = useAlertStore()

  const key = makeLoadingKey(path)
  loadingStore.markLoading(key)
  console.log("### useApiRequest", key, path)
  const { data, error } = await useAsyncData<Type>(
    key,
    (ctx) =>
      $fetch(BASE_URL + "/api/" + path, {
        method: method,
        body: payload,
        credentials: "include",
        headers: getHeaders(ctx!, method != "GET"),
        params: params,
      }),
    { initialCache: false }
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
      let title: string
      let text = ""
      if (typeof onError === "string") {
        title = onError
      } else {
        title = onError.title
        text = onError.text || ""
        if (text === "_responseBody") {
          text = error.value.data
        }
      }
      alertStore.alert(title, text, "error")
    }
  } else {
    loadingStore.markDone(key)
    if (onSuccess) {
      let title: string
      let text = ""
      if (typeof onSuccess === "string") {
        title = onSuccess
      } else {
        title = onSuccess.title
        text = onSuccess.text || ""
      }
      alertStore.alert(title, text, "success")
    }
  }
  return { data, error }
}

export async function useApiGet<Type>(
  path: string,
  params = {},
  onSuccess: Alert | string | null = null,
  onError: Alert | string | boolean = false
) {
  return useApiRequest<Type>("GET", path, undefined, params, onSuccess, onError)
}

export async function useApiPost<Type>(
  path: string,
  payload = {},
  params = {},
  onSuccess: Alert | string | null = null,
  onError: Alert | string | boolean = false
) {
  return useApiRequest<Type>("POST", path, payload, params, onSuccess, onError)
}

export async function useApiPatch<Type>(
  path: string,
  payload = {},
  params = {},
  onSuccess: Alert | string | null = null,
  onError: Alert | string | boolean = false
) {
  return useApiRequest<Type>("PATCH", path, payload, params, onSuccess, onError)
}

export async function useApiDelete<Type>(
  path: string,
  params = {},
  onSuccess: Alert | string | null = null,
  onError: Alert | string | boolean = false
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
