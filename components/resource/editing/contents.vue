<template>
  <div>
    <h6>Contenu</h6>
    <button @click="isGridView = !isGridView">toggle grid view</button>
    <ContentListEdit
      v-show="!isGridView"
      v-model="contents"
      @new-content="newContent"
      @delete-content="onDelete"
    />
    <client-only>
      <ContentGridEdit
        v-show="isGridView"
        v-model="contents"
        v-model:enabled="isGridViewEnabled"
        @new-content="newContent"
        @delete-content="onDelete"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { Content } from "~/composables/types"
import {
  getResourceContents,
  addContent,
  deleteContent,
} from "~/composables/contentsHelper"

const resourceStore = useResourceStore()

const isGridViewEnabled = ref<boolean>(true) // TODO is computed from resource
const isGridView = ref<boolean>(true) // TODO

const contents = ref<Content[]>(
  (await getResourceContents(resourceStore.currentId!)) || []
)

const nextOrder = computed<number>(() => {
  if (contents.value.length === 0) return 0
  return contents.value.slice(-1)[0].order! + 1
})

async function newContent(type: string) {
  const content = await addContent(
    type,
    nextOrder.value,
    resourceStore.currentId!
  )
  contents.value.push(content)
}

async function onDelete({ id, index }: { id: number; index: number }) {
  if (await deleteContent(id)) contents.value.splice(index, 1)
  // TODO display error
}
</script>

<style scoped lang="sass"></style>
