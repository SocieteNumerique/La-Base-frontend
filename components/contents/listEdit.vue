<template>
  Ajouter :
  <div class="fr-grid-row">
    <button>Un lien</button>
    <button>Un fichier</button>
    <button>Un texte</button>
  </div>
  <ul>
    <li v-for="content of contents" class="fr-grid-row">
            <div class="left">
      <div class="type-icon" />
      {{ content.title }}
      <DsfrTag :label="content.licence" :small="true" />
      <button>Légender</button>
      </div>
      <div class="right">
        <button>delete</button>
        <button>params</button>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { Content } from "~/composables/types"

const props = defineProps({
  resourceId: { type: Number, default: 1 }
})

const contents = ref<Content[]>([{
  id: 1,
  title: "titre1",
  annotation: "blabla",
  type: "file"
}])

</script>

<style lang="sass" scoped>
.left
  align-self: start

.right
  align-self: end
</style>
