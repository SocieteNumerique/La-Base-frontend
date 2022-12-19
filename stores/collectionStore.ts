import { defineStore } from "pinia"
import { PinStatus, Collection } from "~/composables/types"
import { useApiGet, useApiPatch, useApiPost } from "~/composables/api"
import { useBaseStore } from "~/stores/baseStore"

type CollectionsById = {
  [id: number]: Collection
}

type CollectionState = {
  currentId?: number
  collectionsById: CollectionsById
}

export const useCollectionStore = defineStore("collection", {
  state: () =>
    <CollectionState>{
      collectionsById: {},
    },
  actions: {
    async createCollection(collection: Collection) {
      const { data, error } = await useApiPost<Collection>(
        "collections/",
        collection,
        {},
        "La collection a bien été créée",
        true,
        collection?.profileImage?.image?.base64
          ? "Chargement de l'image"
          : false
      )
      if (!error.value) {
        this.collectionsById[data.value!.id!] = data.value!
        useBaseStore().addCollectionIdToBase(data.value!)
        return data.value
      }
    },
    async getCollection(collectionId: number) {
      const { data, error } = await useApiGet<Collection>(
        `collections/${collectionId}/`
      )
      if (!error.value) {
        const collection = data.value
        this.collectionsById[collection!.id!] = collection!
        console.log("### got collection", collectionId, collection!.id)
        return collection
      }
    },
    async save(collectionId: number | undefined = undefined) {
      if (collectionId == undefined) {
        collectionId = this.currentId!
      }
      const collection = this.collectionsById[collectionId!]
      return this.update(collectionId, collection)
    },
    async update(collectionId: number, collection: any) {
      const { data, error } = await useApiPatch<Collection>(
        `collections/${collectionId}/`,
        collection,
        {},
        "La collection a bien été sauvegardée",
        true,
        collection?.profileImage?.image?.base64
          ? "Chargement de l'image"
          : false
      )
      if (!error.value) {
        this.collectionsById[data.value!.id!] = data.value!
      }
    },
    async delete(collectionId: number) {
      const { error } = await useApiDelete(
        `collections/${collectionId}/`,
        {},
        "La collection a bien été supprimée",
        true
      )
      if (!error.value) {
        useBaseStore().removeCollectionIdFromBase(collectionId)
        return true
      }
    },
    refreshPinStatus(pinnedInBases: PinStatus[], collectionId: number) {
      const collection = this.collectionsById[collectionId]
      collection.pinnedInBases = pinnedInBases
    },
    async updateResourceOnCollection(
      collectionId: number,
      resourceId: number,
      action: "add" | "remove"
    ) {
      const { data, error } = await useApiPatch<Collection>(
        `collections/${collectionId}/resources/`,
        { resourceId, action },
        {},
        `La resource a bien été ${
          action === "add" ? "ajoutée" : "retirée"
        } à la collection`,
        true
      )
      if (!error.value) {
        this.collectionsById[data.value!.id!] = data.value!
      }
    },
  },
})
