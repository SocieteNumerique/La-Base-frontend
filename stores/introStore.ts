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

  watch(
    () => route.name,
    (value) => {
      console.log("### new route", value)
      indexInPage.value = -1
      next()
    }
  )

  const getIntros = async () => {
    const { data, error } = await useApiGet<Intro[]>("intros/")
    if (!error.value) {
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
      console.log("### not possible anymore")
      markSeen()
      return
    }
    skipIfDoesNotExist()
  }

  const skipIfDoesNotExist = () => {
    if (process.client) {
      const possibleSlugs = Array.from(
        document.getElementsByClassName("tooltip-container")
      ).map((el) => el.getAttribute("slug"))
      console.log("### next", possibleSlugs, current.value?.slug)
      if (possibleSlugs.indexOf(current.value?.slug) === -1) {
        console.log("#### not found, next")
        next()
      }
    }
  }

  const canGoPrevious = computed(() => {
    return indexInPage.value > 0
  })

  const previous = () => {
    if (canGoPrevious.value) {
      indexInPage.value -= 1
    }
  }

  const current = computed<Intro | null>(() => {
    if (indexInPage.value < forPage.value.length) {
      return forPage.value[indexInPage.value]
    }
    return null
  })

  const forPage = computed<Intro[]>(() => {
    let page = <string>route.name
    // route name may contain id in it (ex /base/23), we remove it
    page = page.replace(/\/\d+/, "")
    // we also remove trailing slash
    page = page.replace(/\/$/, "")
    console.log("### forPage, seen ?", seenPages.value[page])
    if (seenPages.value[page]) {
      return []
    }
    if (indexInPage.value === 0) {
      skipIfDoesNotExist()
    }
    return intros.value.filter((intro) => intro.page === page)
  })

  // load intros the first time
  getIntros()

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
