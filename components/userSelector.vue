<template>
  <div>
    <div class="fr-search-bar fr-input-group">
      <input
        id="user-selector"
        v-model="textInput"
        class="fr-input"
        type="text"
        @focus="emit('focus')"
        @input="onInput"
      />
      <button class="fr-btn">
        <VIcon name="ri-search-line" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useApiPost } from "~/composables/api"
import { SearchResult } from "~/composables/types"

const props = defineProps({
  modelValue: { type: Number, default: () => undefined },
  label: { type: String, default: () => "Choisissez une base" },
  description: { type: String, default: () => "" },
})

const textInput = ref("")
const emit = defineEmits(["select"])

const onInput = debounce(async () => {
  console.log("### on text input")
  let endpoint = `search/users`
  const { data, error } = await useApiPost<SearchResult>(endpoint, {
    text: textInput.value,
  })
  if (!error.value) {
    console.log("### results", data.value)
  }
}, 200)
</script>
