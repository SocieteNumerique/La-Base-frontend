<template>
  <div>
    <h2 class="title is-2">Liste</h2>
    Ajouter :
    <div class="fr-grid-row">
      <button @click="$emit('newContent', 'link')">Un lien</button>
      <button @click="$emit('newContent', 'file')">Un fichier</button>
      <button @click="$emit('newContent', 'text')">Un texte</button>
    </div>
    <ul>
      <li v-for="(content, index) of contents" :key="index">
        <ContentListItem
          v-model="contents[index]"
          @delete="$emit('delete-content', content.id)"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Content } from "~/composables/types"
import { PropType } from "vue"
import { useModel } from "~/composables/modelWrapper"

const props = defineProps({
  modelValue: { type: Array as PropType<Content[]>, default: () => [] },
})
defineEmits({
  newContent(type: string) {
    return ["text", "file", "link", "linkedResource"].includes(type)
  },
  "delete-content": null,
})

const contents = useModel<Content[]>("modelValue", { type: "array" })
</script>

<style lang="sass" scoped></style>
