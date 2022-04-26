<template>
  <div>
  <h2 class="title is-2">Liste</h2>
  Ajouter :
  <div class="fr-grid-row">
    <button>Un lien</button>
    <button>Un fichier</button>
    <button @click="addTextContent">Un texte</button>
  </div>
  <ul>
    <li v-for="(content, index) of contents" :key="index" >
      <ContentListItem v-model="contents[index]" />
    </li>
  </ul>
  </div>
</template>

<script lang="ts" setup>
import {Content} from "~/composables/types"
import {PropType} from "vue"
import {useModel} from "~/composables/modelWrapper"

const props = defineProps({
  modelValue: {type: Object as PropType<Content[]>, default: () => []},
})

const contents = useModel<Content[]>("modelValue", {type: "array"})

function addContent(content: Content): void {
  contents.value.push(content)
}

function addTextContent(): void {
  const textContent = {type: "text", text: ""}
  addContent(textContent)
}
</script>

<style lang="sass" scoped>
</style>
