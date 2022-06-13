<template>
  <NuxtLayout name="default">
    <template #header>
      <div style="background: #e8edff" class="fr-py-4w">
        <div class="fr-container">
          <h1 class="fr-h1 fr-mb-0">Rechercher</h1>
        </div>
      </div>
    </template>
    <div>
      <DsfrRadioButtonSet
        v-model="radioValue"
        name="dataType"
        :inline="true"
        :options="radioOptions"
        :required="true"
        legend="Rechercher"
        @update:model-value="onRadioChange"
      />
    </div>
    <div class="fr-search-bar fr-input-group">
      <input
        id="search"
        v-model="textInput"
        class="fr-input"
        type="text"
        style="max-width: 586px"
        placeholder="Rechercher sur toute la plateforme"
        @input="onTextInput"
      />
      <button class="fr-btn">
        <VIcon name="ri-search-line" />
      </button>
    </div>
    <div class="fr-mb-4w">
      <div v-if="radioValue === 'bases'" class="is-flex">
        <BaseMiniature v-for="base of results" :key="base.id" :base="base" />
      </div>
      <div v-if="radioValue === 'resources'" class="resource-grid">
        <ResourceMiniature
          v-for="(resource, index) of results"
          :key="resource.id"
          v-model="results[index].basesPinnedIn"
          :resource="resource"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { DsfrRadioButtonSet } from "@laruiss/vue-dsfr"
import { useApiPost } from "~/composables/api"
import {
  BasesSearchResult,
  ResourcesSearchResult,
  Base,
  Resource,
} from "~/composables/types"

definePageMeta({
  layout: false,
  title: "Base",
})

const results = ref<Base[] | Resource[]>([])
const textInput = ref("")
const radioOptions = [
  {
    label: "des fiches resources",
    value: "resources",
  },
  {
    label: "des bases",
    value: "bases",
  },
]
const radioValue = ref("resources")
const onRadioChange = (newValue: string) => {
  radioValue.value = newValue
  onTextInput()
}
const onTextInput = debounce(async () => {
  console.log("### on text input")
  let endpoint = `search/${radioValue.value}`
  const { data, error } = await useApiPost<
    BasesSearchResult | ResourcesSearchResult
  >(endpoint, {
    text: textInput.value,
  })
  if (!error.value) {
    console.log("### results", data.value)
    results.value = data.value.objects
  }
}, 200)
</script>
