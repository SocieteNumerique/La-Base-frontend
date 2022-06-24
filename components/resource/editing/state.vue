<template>
  <div>
    <DsfrRadioButtonSet
      v-model="radioValue"
      name="resourceStatus"
      :inline="true"
      :options="options"
      :required="true"
      legend="Le statut de la ressource est"
      @update:model-value="onChange"
    />
    <div v-if="!canGoPublicOnMounted">
      <div v-if="!canGoPublic" class="fr-alert fr-alert--info">
        <p class="fr-alert__title">
          La ressource ne peut être publiée en public
        </p>
        <p>
          Pour passer la ressource en public, il manque les informations
          suivantes :
        </p>
      </div>
      <div v-else class="fr-alert fr-alert--success">
        <p class="fr-alert__title">La ressource peut maintenant être publiée</p>
      </div>

      <div class="fr-mt-3w"></div>

      <TagSelector
        v-for="category in missingCategoriesToGoPublicOnMounted"
        :key="category.id"
        :is-focused="focusedCategory === category.name"
        :category="category"
        @focus="focusCategory(category.name)"
        @blur="focusCategory('')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { DsfrRadioButtonSet } from "@laruiss/vue-dsfr"
import { useResourceStore } from "~/stores/resourceStore"
import { computed, onMounted } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { TagCategory } from "~/composables/types"

const resourceStore = useResourceStore()
const tagStore = useTagStore()

const focusedCategory = ref("")

const focusCategory = (categoryName: string) => {
  focusedCategory.value = categoryName
}

const radioValue = ref("")
let missingCategoriesToGoPublicOnMounted = ref<TagCategory[]>([])
let canGoPublicOnMounted = ref(true)

onMounted(() => {
  if (!resourceStore.current) {
    return
  }
  radioValue.value = resourceStore.current.state
  canGoPublicOnMounted.value = canGoPublic.value
  missingCategoriesToGoPublicOnMounted.value = missingCategoriesToGoPublic.value
})

const missingCategoriesToGoPublic = computed((): TagCategory[] => {
  const toReturn: TagCategory[] = []
  for (const category of tagStore.categories) {
    if (category.relatesTo !== "Resource" || !category.requiredToBePublic) {
      continue
    }
    // check if we have selected at least a tag in this category
    let skipCategory = false
    for (const selectedTagId of resourceStore.current.tags!) {
      if (category.tags.indexOf(selectedTagId) !== -1) {
        skipCategory = true
        break
      }
    }
    if (!skipCategory) {
      toReturn.push(category)
    }
  }
  return toReturn
})

const canGoPublic = computed(
  () => missingCategoriesToGoPublic.value.length === 0
)

const options = computed(() => {
  canGoPublic.value
  return [
    {
      label: "Public",
      value: "public",
      disabled: !canGoPublic.value,
    },
    {
      label: "Privé",
      value: "private",
    },
    {
      label: "Brouillon",
      value: "draft",
    },
  ]
})
const onChange = (newValue: string) => {
  radioValue.value = newValue
  resourceStore.resourcesById[resourceStore.currentId!].state = newValue
  resourceStore.markDirty()
}
</script>
