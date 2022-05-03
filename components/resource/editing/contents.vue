<template>
  <div>
    <h6>Contenu</h6>
    <button @click="isGridView = !isGridView">toggle grid view</button>
    <ContentListEdit
      v-show="!isGridView"
      v-model="contents"
      @new-content="newContent"
    />
    <client-only>
      <ContentGridEdit
        v-show="isGridView"
        v-model="contents"
        v-model:enabled="isGridViewEnabled"
        @new-content="newContent"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { Content } from "~/composables/types"
import { getResourceContents, addContent } from "~/composables/contentsHelper"

const resourceStore = useResourceStore()

const isGridViewEnabled = ref<boolean>(true) // TODO is computed from resource
const isGridView = ref<boolean>(true) // TODO

const contents = ref<Content[]>(
  (await getResourceContents(resourceStore.currentId!))!
)

async function newContent(type: string) {
  const content = await addContent(
    type,
    contents.value.length,
    resourceStore.currentId!
  )
  contents.value.push(content)
}
</script>

<style scoped lang="sass"></style>
