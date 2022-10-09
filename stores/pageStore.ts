import { defineStore } from "pinia"
import { Page } from "~/composables/types"
import { useApiGet } from "~/composables/api"
import { useRoute } from "vue-router"

type PagesBySlug = {
  [slug: string]: Page
}

type PageState = {
  order: string[]
  pagesBySlug: PagesBySlug
}

export const usePageStore = defineStore("page", {
  state: () =>
    <PageState>{
      pagesBySlug: {},
      order: [],
    },
  actions: {
    async getPage(pageSlug: string) {
      const { data, error } = await useApiGet<Page>(`pages/${pageSlug}/`)
      if (!error.value) {
        const page = data.value!
        this.pagesBySlug[page.slug] = page
        return page
      }
    },
    async getPages() {
      const { data, error } = await useApiGet<Page[]>("pages/")
      if (!error.value) {
        for (const page of data.value!) {
          if (
            !this.pagesBySlug[page.slug] ||
            this.pagesBySlug[page.slug].isShort
          ) {
            this.pagesBySlug[page.slug] = page
          }
          this.order = data.value!.map((page) => page.slug)
        }
      }
    },
  },
  getters: {
    current: (state): Page | null => {
      const slug = <string>useRoute().params.slug
      if (slug && state.pagesBySlug[slug]) {
        return state.pagesBySlug[slug]
      }
      return null
    },
    pages: (state) => {
      return Object.values(state.order).map(
        (pageSlug) => state.pagesBySlug[pageSlug]
      )
    },
  },
})
