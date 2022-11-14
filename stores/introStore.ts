import { defineStore } from "pinia"
import { useApiGet } from "~/composables/api"
import { useRoute } from "vue-router"
import { computed, watch } from "vue"
import { useUserStore } from "~/stores/userStore"

type Intro = {
  htmlContent: string
  id: number
  image?: string
  page: string
  position: "right" | "left" | "bottom" | "top"
  seen: boolean
  slug: string
  title: string
}

export const useIntroStore = defineStore("intro", () => {
  const route = useRoute()
  const userStore = useUserStore()

  const intros = ref<Intro[]>([])
  const seenPages = ref<{ [key: string]: boolean }>({})
  const indexInPage = ref(0)
  const forceRecheckPage = ref(0)
  const ready = ref(false)

  const saveLocallySeen = () => {
    localStorage.setItem("seenPages", JSON.stringify(seenPages.value))
  }
  const loadLocallySeen = () => {
    const seenPagesLocally = localStorage.getItem("seenPages")
    if (seenPagesLocally) {
      seenPages.value = JSON.parse(seenPagesLocally)
      forceRecheckPage.value += 1
    }
  }
  const resetLocallySeen = () => {
    seenPages.value = {}
  }

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
      for (const intro of intros.value) {
        if (intro.seen) {
          markSeen(false, intro.page)
        }
      }
    }
  }

  const markSeen = (send = true, page = "") => {
    if (page === "") {
      page = <string>route.name
    }
    seenPages.value[page] = true
    if (userStore.isLoggedIn && send) {
      useApiGet("seen-page/" + page)
    } else {
      saveLocallySeen()
    }
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
    if (!ready.value) {
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
    // use settimeout, otherwise store hydration might override seenPages after
    //  we load them from local storage
    setTimeout(() => {
      if (!userStore.isLoggedIn) {
        loadLocallySeen()
      }
      ready.value = true
    }, 500)
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
    resetLocallySeen,
    loadLocallySeen,
  }
})
