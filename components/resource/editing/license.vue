<template>
  <div>
    <DsfrRadioButtonSet
      v-model="radioValue"
      name="accessRequiresUserAccount"
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
  if (resourceStore.current.accessRequiresUserAccount === false) {
    radioValue.value = "0"
  } else if (resourceStore.current.accessRequiresUserAccount === true) {
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
  resourceStore.resourcesById[
    resourceStore.currentId!
  ].accessRequiresUserAccount = !!parseInt(newValue)
  resourceStore.markDirty()
}
</script>
