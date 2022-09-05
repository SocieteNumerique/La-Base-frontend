<template>
  <div>
    <label class="fr-label search" for="resource-selector">{{
      props.label
    }}</label>
    <div class="fr-search-bar fr-input-group fr-mb-0">
      <input
        id="resource-selector"
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
        v-model="selectedResources"
        :options="resultsAsCheckboxOptions"
        class="resource-choices"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Resource } from "~/composables/types"
import { computed, PropType } from "vue"
import { DsfrCheckboxSet } from "@laruiss/vue-dsfr"
import { useBaseStore } from "~/stores/baseStore"
import { useResourceStore } from "~/stores/resourceStore"

const baseStore = useBaseStore()
const resourceStore = useResourceStore()

defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: { type: Array as PropType<Resource[]>, default: () => [] },
  label: { type: String, default: "Choisissez une ressource" },
  baseId: { type: Number, required: true },
  placeholder: { type: String, default: "" },
})

const textInput = ref("")
const results = ref<Resource[]>(
  baseStore.basesById[props.baseId].resourceChoices || []
)

const selectedResources = useModel<Resource[]>("modelValue", {
  type: "array",
})
const resultsAsCheckboxOptions = computed<
  { label: string; id: number; name: number }[]
>(() =>
  results.value.map((resource) => {
    return { label: resource.title, id: resource.id, name: resource.id }
  })
)
const onInput = debounce(async () => {
  const base = baseStore.basesById[props.baseId]
  if (!textInput.value) return (results.value = base.resourceChoices || [])
  results.value =
    base.resourceChoices?.filter((resource) =>
      resource.title.toLowerCase().includes(textInput.value.toLowerCase())
    ) || []
}, 200)
</script>
