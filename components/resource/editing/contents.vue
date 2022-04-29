<template>
  <div>
    <h6>Contenu</h6>
    <button @click="isGridView = !isGridView">toggle grid view</button>
    <ContentListEdit
      v-show="!isGridView"
      v-model="contents"
      @new-content="addContent"
    />
    <client-only>
      <ContentGridEdit
        v-show="isGridView"
        v-model="contents"
        v-model:enabled="isGridViewEnabled"
        @new-content="addContent"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { Content } from "~/composables/types"

const resourceStore = useResourceStore()

const isGridViewEnabled = ref<boolean>(true) // TODO is computed from resource
const isGridView = ref<boolean>(true) // TODO

const contents = ref<Content[]>(
  (await resourceStore.getResourceContents(resourceStore!.currentId!))!
)

async function addContent(type: string) {
  const content: Content = await resourceStore.addContent(type)
  contents.value.push(content)
}
</script>

<style scoped lang="sass"></style>
