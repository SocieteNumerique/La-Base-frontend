<template>
  <div>
    <h2 class="title is-2">Liste</h2>
    Ajouter :
    <div class="fr-grid-row">
      <button @click="$emit('new-content', 'link')">Un lien</button>
      <button @click="$emit('new-content', 'file')">Un fichier</button>
      <button @click="$emit('new-content', 'text')">Un texte</button>
    </div>
    <draggable
      v-model="contents"
      :animation="100"
      item-key="id"
      tag="ul"
      @end="sendNewOrder"
    >
      <template #item="{ index }">
        <li draggable="true">
          <ContentListItem
            v-model="contents[index]"
            @delete="$emit('delete-content', { id: contents[index].id, index })"
          />
        </li>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
import { Content, ContentOrder } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"
import { updateOrder } from "~/composables/contentsHelper"
// pycharm tells me that the import is not used, but it IS
import draggable from "vuedraggable"

defineProps({
  modelValue: { type: Array as PropType<Content[]>, default: () => [] },
})
defineEmits({
  newContent(type: string) {
    return ["text", "file", "link", "linkedResource"].includes(type)
  },
  "delete-content": null,
})

const contents = useModel<Content[]>("modelValue", { type: "array" })

async function sendNewOrder() {
  const newOrder = contents.value.reduce(
    (
      prev: { [key: number]: { section?: number; order?: number } },
      content: Content,
      index
    ) => {
      prev[content.id!] = { order: index, section: content.section }
      return prev
    },
    {}
  )
  return updateOrder(newOrder)
}
</script>

<style lang="sass" scoped></style>
