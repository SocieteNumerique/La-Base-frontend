import { defineStore } from "pinia"
import { Base, Resource, Tag, TagCategory } from "~/composables/types"
import { useApiPost } from "~/composables/api"

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
    async refreshTags() {
      const { data, error } = await useApiGet<Tag[]>("tags/")
      if (!error.value) {
        const tags = data.value
        for (const tag of tags) {
          this.tagsById[tag.id] = tag
        }
      }
    },
    async refreshTagCategories() {
      const { data, error } = await useApiGet<TagCategory[]>("tag_categories/")
      if (!error.value) {
        const categories = data.value
        for (const category of categories) {
          this.tagCategoriesById[category.id] = category
          this.tagCategoryIdsByName[category.name] = category.id
        }
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
