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
    <div class="is-flex fr-mb-4w">
      <template v-if="radioValue === 'bases'">
        <BaseCard
          v-for="baseId of resultIds"
          :key="baseId"
          :base="baseStore.basesById[baseId]"
        />
      </template>
    </div>
    <pre>{{ resultIds }}</pre>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { DsfrRadioButtonSet } from "@laruiss/vue-dsfr"
import { useApiPost } from "~/composables/api"
import { BasesSearchResult } from "~/composables/types"
import { useBaseStore } from "~/stores/baseStore"
import { useResourceStore } from "~/stores/resourceStore"

const baseStore = useBaseStore()

definePageMeta({
  layout: false,
  title: "Base",
})

const resultIds = ref<number[]>([])
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
  const { data, error } = await useApiPost<BasesSearchResult>(endpoint, {
    text: textInput.value,
  })
  if (!error.value) {
    if (radioValue.value === "bases") {
      for (const base of data.value.objects) {
        // @ts-ignore
        baseStore.basesById[base.id] = base
      }
    }
    if (radioValue.value === "resources") {
      for (const resource of data.value.objects) {
        // @ts-ignore
        resourceStore.resourcesById[resource.id] = resource
      }
    }
    resultIds.value = data.value.objects.map((el) => el.id)
  }
}, 200)
</script>
