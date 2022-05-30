<template>
  <DsfrInput
    v-model="resourceLink"
    :label-visible="true"
    label="Lien de la resource"
    placeholder="https://"
    type="url"
  />
  <DsfrInput
    v-model="content.title"
    :label-visible="true"
    label="Titre de lien"
    placeholder="Titre de lien"
  />
  <DsfrInput
    v-model="content.annotation"
    :is-textarea="true"
    :label-visible="true"
    label="Légende"
    placeholder="Légende"
  />
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { LinkedResourceContent } from "~/composables/types"

defineProps({
  modelValue: {
    type: Object as PropType<LinkedResourceContent>,
    required: true,
  },
})

const content = useModel<LinkedResourceContent>("modelValue", {
  type: "object",
})
const resourceLink = computed<string>({
  get() {
    return `ressources/${content.value.linkedResource}`
  },
  set(value) {
    content.value.linkedResource = parseInt(
      value.match(/ressources\/(\d+)/)![1]!
    )
  },
})
useRoute()
</script>

<style lang="sass" scoped></style>
