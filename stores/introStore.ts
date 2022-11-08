import { defineStore } from "pinia"
import { useApiGet } from "~/composables/api"
import { useRoute } from "vue-router"
import { computed, watch } from "vue"

type Intro = {
  content: string
  id: number
  image?: string
  page: string
  position: "right" | "left" | "bottom" | "top"
  slug: string
  title: string
}

export const useIntroStore = defineStore("intro", () => {
  const route = useRoute()

  const intros = ref<Intro[]>([])
  const seenPages = ref<{ [key: string]: boolean }>({})
  const indexInPage = ref(0)
  const forceRecheckPage = ref(0)

  watch(
    () => route.name,
    (value) => {
      indexInPage.value = 0
      // we re-check later when DOM has initialised
      setTimeout(() => {
        forceRecheckPage.value += 1
      }, 400)
    }
  )

  const getIntros = async () => {
    const { data, error } = await useApiGet<Intro[]>("intros/")
    if (!error.value && data.value!) {
      intros.value = data.value!
    }
  }

  const markSeen = () => {
    const page = <string>route.name
    seenPages.value[page] = true
  }

  const canGoNext = computed(() => {
    return indexInPage.value < forPage.value.length - 1
  })

  const next = () => {
    if (canGoNext.value) {
      indexInPage.value += 1
    } else {
      markSeen()
      return
    }
    skipIfDoesNotExist()
  }

  const doesATooltipExistWithSlug = (slug: string | undefined) => {
    if (process.server) {
      return true
    }
    if (slug == null) {
      return false
    }
    const possibleSlugs = Array.from(
      document.getElementsByClassName("tooltip-container")
    ).map((el) => el.getAttribute("slug"))

    return possibleSlugs.indexOf(slug) !== -1
  }

  const skipIfDoesNotExist = (forward = true) => {
    if (process.client) {
      if (!doesATooltipExistWithSlug(current.value?.slug)) {
        if (forward) {
          next()
        } else {
          previous()
        }
      }
    }
  }

  const canGoPrevious = computed(() => {
    return indexInPage.value > 0
  })

  const previous = () => {
    if (canGoPrevious.value) {
      indexInPage.value -= 1
    } else {
      next()
      return
    }
    skipIfDoesNotExist(false)
  }

  const current = computed<Intro | null>(() => {
    if (indexInPage.value < forPage.value.length) {
      return forPage.value[indexInPage.value]
    }
    return null
  })

  const forPage = computed<Intro[]>(() => {
    forceRecheckPage.value
    if (process.server) {
      return []
    }
    let page = <string>route.name
    // route name may contain id in it (ex /base/23), we remove it
    page = page.replace(/\/\d+/, "")
    // we also remove trailing slash
    page = page.replace(/\/$/, "")
    if (seenPages.value[page]) {
      return []
    }

    return intros.value
      .filter((intro) => intro.page === page)
      .filter((intro) => doesATooltipExistWithSlug(intro.slug))
  })

  // load intros the first time, only in client to avoid SSR bugs
  if (process.client) {
    getIntros()
  }

  return {
    intros,
    seenPages,
    indexInPage,
    getIntros,
    markSeen,
    next,
    canGoNext,
    previous,
    canGoPrevious,
    current,
    forPage,
  }
})
