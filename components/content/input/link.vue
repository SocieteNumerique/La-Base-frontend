<template>
  <DsfrInput
    v-model="content.link"
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
import { LinkContent } from "~/composables/types"

defineProps({
  modelValue: { type: Object as PropType<LinkContent>, required: true },
})

const content = useModel("modelValue", { type: "object" })
</script>
