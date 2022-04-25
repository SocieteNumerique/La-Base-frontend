<template>
  <div class="fr-col-2 fr-mt-5v">
    <div v-for="(item, index) of menu" :key="index"
         class="fr-text-title--blue-france fr-text--lg fr-text--bold fr-pt-3v fr-pb-3v menu-item fr-pl-2w">
      <div>
        {{ item }}
      </div>
    </div>
  </div>

  <div class="fr-col-6 fr-col-offset-1 fr-mt-12w">
    <h6>Informations générales</h6>

    <h6>Contenu</h6>
    <button @click="isGridView = !isGridView">toggle grid view</button>
    <ContentListEdit v-show="!isGridView" v-model="contents"/>
    <client-only>
      <ContentGridEdit v-show="isGridView" v-model="contents" v-model:enabled="isGridViewEnabled"/>
    </client-only>
  </div>

  <div class="fr-col-3 fr-mt-12w">Vérification des doublons</div>
</template>

<script setup lang="ts">
import {useBaseStore} from '~/stores/baseStore';
import {Content, Resource} from '~/composables/types'

definePageMeta({
  title: "Nouvelle ressource",
})

const route = useRoute()
const baseStore = useBaseStore()

const resourceId = route.params.id as unknown as number
const menu = ref<string[]>(["Informations", "Contenus (2)", "Label(s)"])
const isGridViewEnabled = ref<boolean>(true) // TODO is computed from resource
const isGridView = ref<boolean>(true) // TODO

if (!baseStore.resourcesById[resourceId]) {
  baseStore.getResource(resourceId)
}
const resource = computed(() => baseStore.resourcesById[resourceId])
const contents = ref<Content[]>((await baseStore.getResourceContents(resourceId)) as unknown as Content[])

contents.value.forEach((content) => {
  if ("nbCol" in content) return
  content.nbCol = 4
})
// if (base.value?.isShort) {
//     console.log("is short")
//     baseStore.getBase(base.value.id)
// }

// watch(base, async (newBase: Base) => {
//     console.log("### newBase", newBase)
//     if (newBase.isShort) {
//         baseStore.getBase(newBase.id)
//     }
// })

</script>

<style lang="sass" scoped>
.menu-item
  border-top: var(--grey-925-125) 1px solid
  margin: 0

  &:last-child
    border-bottom: var(--grey-925-125) 1px solid


</style>
