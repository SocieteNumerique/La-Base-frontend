import { defineStore } from "pinia"
import { useApiGet, useApiPatch, useApiPost } from "~/composables/api"
import { useBaseStore } from "~/stores/baseStore"
import { BaseSection, ObjectById } from "~/composables/types"

type BaseSectionState = {
  baseSectionsById: ObjectById<BaseSection>
}

export const useBaseSectionStore = defineStore("baseSection", {
  state: () =>
    <BaseSectionState>{
      baseSectionsById: {},
    },
  actions: {
    async createSection(section: BaseSection) {
      const { data, error } = await useApiPost<BaseSection>(
        "base-sections/",
        section,
        {},
        "La rubrique a bien été créée",
        true
      )
      if (!error.value) {
        this.baseSectionsById[data.value!.id!] = data.value!
        useBaseStore().addSectionIdToBase(data.value!)
        return data.value
      }
    },
    async update(sectionId: number, section: BaseSection) {
      const { data, error } = await useApiPatch<BaseSection>(
        `base-sections/${sectionId}/`,
        section,
        {},
        "La rubrique a bien été sauvegardée",
        true
      )
      if (!error.value) {
        this.baseSectionsById[data.value!.id!] = data.value!
      }
    },
    async delete(sectionId: number) {
      const { error } = await useApiDelete(
        `base-sections/${sectionId}/`,
        {},
        "La rubrique a bien été supprimée",
        true
      )
      if (!error.value) {
        delete this.baseSectionsById[sectionId]
        useBaseStore().removeSectionIdFromBase(sectionId)
        return true
      }
    },
    async save(section: BaseSection) {
      return section.id
        ? await this.update(section.id, section)
        : await this.createSection(section)
    },
  },
})
