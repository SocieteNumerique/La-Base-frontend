<template>
  <div>
    <DsfrRadioButtonSet
      v-model="radioValue"
      name="resourceStatus"
      :inline="true"
      :options="options"
      :required="true"
      legend="L'accès à la ressource nécessite la création d'un compte utilisateur ?"
      @update:model-value="onChange"
    />
  </div>
</template>
<script setup lang="ts">
import { DsfrRadioButtonSet } from "@laruiss/vue-dsfr"
import { useResourceStore } from "~/stores/resourceStore"
import { onMounted } from "vue"

const resourceStore = useResourceStore()

const radioValue = ref("")

onMounted(() => {
  if (!resourceStore.current) {
    return
  }
  radioValue.value = resourceStore.current.status
})

const options = [
  {
    label: "public",
    value: "public",
  },
  {
    label: "Privé",
    value: "private",
  },
  {
    label: "Restreint",
    value: "restricted",
  },
  {
    label: "Brouillon",
    value: "draft",
  },
]
const onChange = (newValue: string) => {
  radioValue.value = newValue
  resourceStore.resourcesById[resourceStore.currentId!].status = newValue
  resourceStore.markDirty()
}
</script>
