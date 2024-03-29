import { defineStore } from "pinia"
import { useApiGet } from "~/composables/api"
import { useRoute } from "vue-router"
import { computed, watch } from "vue"
import { useUserStore } from "~/stores/userStore"
import { useAlertStore } from "~/stores/alertStore"

type Intro = {
  htmlContent: string
  id: number
  image?: string
  position: "right" | "left" | "bottom" | "top"
  seen: boolean
  slug: string
  title: string
}

export const useIntroStore = defineStore("intro", () => {
  const route = useRoute()
  const userStore = useUserStore()
  const alertStore = useAlertStore()

  const intros = ref<Intro[]>([])
  const seenSlugs = ref<{ [key: string]: boolean }>({})
  const currentIndex = ref(-1)
  const forceRecheckDom = ref(0)
  const ready = ref(false)

  const saveLocallySeen = () => {
    localStorage.setItem("seenSlugs", JSON.stringify(seenSlugs.value))
  }
  const loadLocallySeen = () => {
    const seenSlugsLocally = localStorage.getItem("seenSlugs")
    if (seenSlugsLocally) {
      seenSlugs.value = JSON.parse(seenSlugsLocally)
      forceRecheckDom.value += 1
    }
  }
  const resetLocallySeen = () => {
    seenSlugs.value = {}
  }

  // recheck which intros are in the dom when route.name has changed
  // and reset the currentIndex to the first one
  watch(
    () => route.name,
    (value) => {
      currentIndex.value = -1
      // we re-check later when DOM has initialised
      setTimeout(() => {
        forceRecheckDom.value += 1
      }, 400)
    }
  )

  // recheck which intros are in the dom when route.query.i has changed
  watch(
    () => route.query.i,
    () => {
      setTimeout(() => {
        forceRecheckDom.value = forceRecheckDom.value + 1
      }, 200)
    }
  )

  const getIntros = async () => {
    const { data, error, pending } = await useApiGet<Intro[]>(
      "intros/",
      {},
      null,
      true
    )
    if (!error.value && data.value!) {
      saveIntros(data.value!)
    } else if (pending.value) {
      // this hack should not be necessary after `await`
      setTimeout(() => {
        if (!error.value && data.value!) {
          saveIntros(data.value!)
        }
      }, 400)
    }
  }

  const saveIntros = (introsList: Intro[]) => {
    console.log("### saving intros", introsList)
    intros.value = introsList
    for (const intro of introsList) {
      if (intro.seen) {
        markSeen(false, [intro.slug])
      }
    }
  }

  const markSeen = (send = true, slugs: string[] = []) => {
    if (slugs.length === 0) {
      slugs = availableIntros.value.map((intro) => intro.slug)
    }
    for (const slug of slugs) {
      seenSlugs.value[slug] = true
    }
    if (userStore.isLoggedIn && send) {
      useApiGet("seen-slugs/" + slugs.join(","))
    } else {
      saveLocallySeen()
    }
  }

  const canGoNext = computed(() => {
    return currentIndex.value < availableIntros.value.length - 1
  })

  const next = () => {
    if (canGoNext.value) {
      currentIndex.value += 1
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
    return currentIndex.value > 0
  })

  const previous = () => {
    if (canGoPrevious.value) {
      currentIndex.value -= 1
    } else {
      next()
      return
    }
    skipIfDoesNotExist(false)
  }

  const current = computed<Intro | null>(() => {
    if (
      currentIndex.value !== -1 &&
      currentIndex.value < availableIntros.value.length
    ) {
      return availableIntros.value[currentIndex.value]
    }
    return null
  })

  const introsIndexSlugsFilteredOutWhenNotInHome = computed(() => {
    // there is an exception for slug starting with INDEX_, only shown
    // on the home page and search page (used in the header for example)
    let toReturn = intros.value
    const isIndex = ["index", "recherche"].indexOf(<string>route.name) !== -1
    if (!isIndex) {
      toReturn = toReturn.filter((intro) => !intro.slug.startsWith("INDEX_"))
    }

    return toReturn
  })

  const availableIntros = computed<Intro[]>(() => {
    forceRecheckDom.value
    if (process.server) {
      return []
    }
    if (!ready.value) {
      return []
    }

    const toReturn = introsIndexSlugsFilteredOutWhenNotInHome.value
      .filter((intro) => !seenSlugs.value[intro.slug])
      .filter((intro) => doesATooltipExistWithSlug(intro.slug))

    console.log("### available intros", toReturn)

    return toReturn
  })

  const showAllInPage = () => {
    let shown = 0
    currentIndex.value = 0
    for (const intro of introsIndexSlugsFilteredOutWhenNotInHome.value) {
      if (doesATooltipExistWithSlug(intro.slug)) {
        seenSlugs.value[intro.slug] = false
        shown += 1
      }
    }
    if (!shown) {
      alertStore.alert(
        "Aucun didacticiel sur cette page",
        "Il n'y a aucun didacticiel sur cette page, mais vous pouvez ré-essayer sur d'autres pages",
        "info"
      )
    }
  }

  const done = () => {
    markSeen()
    currentIndex.value = -1
  }

  // load intros the first time, only in client to avoid SSR bugs
  if (process.client) {
    getIntros()
    // use settimeout, otherwise store hydration might override seenSlugs after
    //  we load them from local storage
    setTimeout(() => {
      if (!userStore.isLoggedIn) {
        loadLocallySeen()
      }
      ready.value = true
    }, 500)
  }

  return {
    availableIntros,
    canGoNext,
    canGoPrevious,
    current,
    currentIndex,
    done,
    getIntros,
    intros,
    loadLocallySeen,
    markSeen,
    next,
    previous,
    resetLocallySeen,
    seenSlugs,
    showAllInPage,
  }
})
