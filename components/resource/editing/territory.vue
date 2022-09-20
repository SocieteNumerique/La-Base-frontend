<template>
  <div>
    <DsfrRadioButtonSet
      v-model="radioValue"
      name="isLinkedToTerritory"
      :inline="true"
      :options="options"
      :required="true"
      legend="Cette ressource est-elle liée à un territoire ?"
      @update:model-value="onChange"
    />
  </div>
</template>
<script setup lang="ts">
import { DsfrRadioButtonSet } from "@gouvminint/vue-dsfr"
import { useResourceStore } from "~/stores/resourceStore"
import { onMounted } from "vue"

const resourceStore = useResourceStore()

const radioValue = ref("")

onMounted(() => {
  if (!resourceStore.current) {
    return
  }
  if (resourceStore.current.isLinkedToATerritory === false) {
    radioValue.value = "0"
  } else if (resourceStore.current.isLinkedToATerritory === true) {
    radioValue.value = "1"
  } else {
    radioValue.value = ""
  }
})

const options = [
  {
    label: "Non",
    value: "0",
  },
  {
    label: "Oui",
    value: "1",
  },
]
const onChange = (newValue: string) => {
  radioValue.value = newValue
  resourceStore.resourcesById[resourceStore.currentId!].isLinkedToATerritory =
    !!parseInt(newValue)
  resourceStore.markDirty()
}
</script>
