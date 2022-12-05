import { defineStore } from "pinia"
import { useApiGet } from "~/composables/api"

type TextBlock = {
  htmlContent: string
  id: number
  slug: string
}

export const useTextBlockStore = defineStore("textBlock", () => {
  const blockBySlug = ref<{ [slug: string]: string }>({})

  const getTextBlocks = async () => {
    const { data, error } = await useApiGet<TextBlock[]>("text_blocks/")
    if (!error.value && data.value!) {
      for (const block of data.value!) {
        blockBySlug.value[block.slug] = block.htmlContent
      }
    }
  }

  return {
    blockBySlug,
    getTextBlocks,
  }
})
