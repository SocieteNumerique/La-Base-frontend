import { defineStore } from "pinia"
import { Tag, TagCategory, TagCategoryWithFullTags } from "~/composables/types"

type TagsById = {
  [id: number]: Tag
}

type TagCategoriesById = {
  [id: number]: TagCategory
}

type TagCategoryIdsByName = {
  [name: string]: number
}

type TagState = {
  tagsById: TagsById
  tagCategoriesById: TagCategoriesById
  tagCategoryIdsByName: TagCategoryIdsByName
}

export const useTagStore = defineStore("tag", {
  state: () =>
    <TagState>{
      tagsById: {},
      tagCategoriesById: {},
      tagCategoryIdsByName: {},
    },
  actions: {
    async refreshIndex() {
      const { data, error } = await useApiGet<TagCategoryWithFullTags[]>(
        "index/"
      )
      if (!error.value) {
        this.saveTagCategoriesToState(data.value)
      }
    },
    async refreshIndexForBase(baseId: number) {
      const { data, error } = await useApiGet<TagCategoryWithFullTags[]>(
        `base/${baseId}/index/`
      )
      if (!error.value) {
        this.saveTagCategoriesToState(data.value)
      }
    },
    saveTagCategoriesToState(categories: TagCategoryWithFullTags[]) {
      for (const category of categories) {
        const tagIds = category.tags!.map((tag) => tag.id)
        for (const tag of category.tags!) {
          this.tagsById[tag.id] = tag
        }
        this.tagCategoriesById[category.id] = { ...category, tags: tagIds }
        this.tagCategoryIdsByName[category.name] = category.id
      }
    },
  },
  getters: {
    categoryByName:
      (state) =>
      (name: string): TagCategory => {
        return state.tagCategoriesById[state.tagCategoryIdsByName[name]]
      },
  },
})
