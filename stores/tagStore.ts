import { defineStore } from "pinia"
import { Tag, TagCategory, TagCategoryWithFullTags } from "~/composables/types"

type TagsById = {
  [id: number]: Tag
}

type TagCategoriesById = {
  [id: number]: TagCategory
}

type TagCategoryIdsBySlug = {
  [slug: string]: number
}

type TagState = {
  tagsById: TagsById
  tagIdsBySlug: { [slug: string]: number }
  tagCategoriesById: TagCategoriesById
  tagCategoriesOrder: number[]
  tagCategoryIdsBySlug: TagCategoryIdsBySlug
}

export const useTagStore = defineStore("tag", {
  state: () =>
    <TagState>{
      tagsById: {},
      tagIdsBySlug: {},
      tagCategoriesById: {},
      tagCategoriesOrder: [],
      tagCategoryIdsBySlug: {},
    },
  actions: {
    async createTag(
      name: string,
      categoryId: number
    ): Promise<number | undefined> {
      const { data, error } = await useApiPost<Tag>("tags/", {
        name,
        category: categoryId,
        isFree: true,
      })
      if (!error.value) {
        const newId = data.value.id
        this.tagsById[newId] = data.value

        // the added tag id has to be also added to the category manually
        const category = this.tagCategoriesById[data.value.category]
        if (category.tags.indexOf(newId) === -1) {
          category.tags.push(newId)
        }
        return data.value.id
      }
      return undefined
    },
    async refreshIndex() {
      const { data, error } = await useApiGet<TagCategoryWithFullTags[]>(
        "index/",
        {}
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
    setTagOfCategory(
      tagId: number | undefined,
      categoryId: number,
      tagIds: number[]
    ) {
      if (tagIds == null) {
        tagIds = tagId ? [tagId] : []
      }
      const tagIdsInCategory = this.tagCategoriesById[categoryId].tags
      const res = tagIds.filter(
        (tagIdToTest) => !tagIdsInCategory.includes(tagIdToTest)
      )
      if (tagId) res.push(tagId)
      return res
    },
    setTagsOfCategory(
      updatedTags: number[],
      categoryId: number,
      tags: number[]
    ) {
      const category = this.tagCategoriesById[categoryId]
      const tagsOfCategory = updatedTags.filter((tagIdToTest) =>
        category.tags.includes(tagIdToTest)
      )
      const tagsOfOtherCategory = tags.filter(
        (tagIdToTest: number) => !category.tags.includes(tagIdToTest)
      )
      Object.assign(tags, [...tagsOfOtherCategory, ...tagsOfCategory])
    },
    saveTagCategoriesToState(categories: TagCategoryWithFullTags[]) {
      this.tagCategoriesOrder = categories.map((category) => category.id)
      for (const category of categories) {
        const tagIds = category.tags!.map((tag) => tag.id)
        for (const tag of category.tags!) {
          this.tagsById[tag.id] = tag
          if (tag.slug) this.tagIdsBySlug[tag.slug] = tag.id
        }
        this.tagCategoriesById[category.id] = { ...category, tags: tagIds }
        this.tagCategoryIdsBySlug[category.slug] = category.id
      }
    },
  },
  getters: {
    categories: (state) => {
      return state.tagCategoriesOrder.map(
        (categoryId) => state.tagCategoriesById[categoryId]
      )
    },
    categoryBySlug:
      (state) =>
      (name: string): TagCategory | undefined => {
        const categoryId = state.tagCategoryIdsBySlug[name]
        if (categoryId == null) {
          return undefined
        }
        return state.tagCategoriesById[categoryId]
      },
  },
})
