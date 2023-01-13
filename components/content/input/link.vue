<template>
  <DsfrInput
    v-model="link"
    :label-visible="true"
    label="Lien URL"
    placeholder="https://"
    type="url"
  />
  <DsfrCheckbox
    v-model="content.withPreview"
    label="Afficher l'aperçu du lien"
    name="preview"
  />
  <DsfrInput
    v-model="content.title"
    :label-visible="true"
    label="Titre de lien"
    placeholder="Titre de lien"
    maxlength="50"
    :hint="`${getLengthOrZero(content.title)} / 50 caractères`"
  />
  <DsfrInput
    v-model="content.annotation"
    :is-textarea="true"
    :label-visible="true"
    label="Légende"
    placeholder="Légende"
    maxlength="280"
    :hint="`${getLengthOrZero(content.annotation)} / 280 caractères`"
  />
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { LinkContent } from "~/composables/types"
import { getLengthOrZero } from "~/composables/utils"

defineProps({
  modelValue: { type: Object as PropType<LinkContent>, required: true },
})

const content = useModel<LinkContent>("modelValue", { type: "object" })
const link = computed<string>({
  get() {
    return content.value?.link
  },
  set(value) {
    if (!content.value) return
    if (/^https?:\/\/.*/.test(value)) return (content.value.link = value)
    content.value.link = `http://${value}`
  },
})
</script>
