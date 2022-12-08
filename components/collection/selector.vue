<template>
  <div>
    <label class="fr-label search" for="collection-selector">{{
      props.label
    }}</label>
    <div class="fr-search-bar fr-input-group fr-mb-0">
      <input
        id="collection-selector"
        v-model="textInput"
        class="fr-input"
        type="text"
        :placeholder="placeholder"
        @input="onInput"
      />
      <button class="fr-btn">
        <VIcon name="ri-search-line" />
      </button>
    </div>

    <!-- search results -->
    <div class="result-line-holder">
      <div v-if="textInput && results.length === 0">
        Aucun résultat correspondant
      </div>
      <DsfrCheckboxSet
        v-model="selectedCollections"
        :options="resultsAsCheckboxOptions"
        class="collection-choices"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Collection } from "~/composables/types"
import { computed, PropType } from "vue"
import { DsfrCheckboxSet } from "@gouvminint/vue-dsfr"
import { useBaseStore } from "~/stores/baseStore"

const baseStore = useBaseStore()

defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: { type: Array as PropType<Collection[]>, default: () => [] },
  label: { type: String, default: "Choisissez une collection" },
  baseId: { type: Number, required: true },
  placeholder: { type: String, default: "" },
})

const textInput = ref("")
const results = ref<Collection[]>(
  baseStore.basesById[props.baseId].collectionChoices || []
)

const selectedCollections = useModel<Collection[]>("modelValue", {
  type: "array",
})
const resultsAsCheckboxOptions = computed<
  { label: string; id: number; name: number }[]
>(() =>
  results.value.map((collection) => {
    return { label: collection.name, id: collection.id, name: collection.id }
  })
)
const onInput = debounce(async () => {
  const base = baseStore.basesById[props.baseId]
  if (!textInput.value) return (results.value = base.collectionChoices || [])
  results.value =
    base.collectionChoices?.filter((collection) =>
      collection.name.toLowerCase().includes(textInput.value.toLowerCase())
    ) || []
}, 200)
</script>
