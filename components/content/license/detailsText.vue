<template>
  <DsfrModal :title="title" :actions="actions" opened @close="$emit('close')">
    <p>
      Si vous avez produit la ressource sans avoir encore défini une license,
      nous vous invitons à choisir une licence libre dans la liste ci-dessous.
      Si cette ressource n’a pas été produite par vous, merci de vous assurer de
      la license sous laquelle celle-ci a été diffusée avant de continuer le
      renseignement.
    </p>
    <TagSelector
      v-if="!proprietary"
      :category="category"
      :is-focused="isFocused"
      :init-tags="refTags"
      source="ownId"
      label="Nom de la licence"
      @blur="isFocused = false"
      @change="refTags = $event"
      @focus="isFocused = true"
    />
    <!--    TODO show file if it is here-->
    <FormFileUpload
      label="Ajouter le texte de la licence"
      @update:model-value="refLicenseText = { ...refLicenseText, file: $event }"
    />
    <FormInputLink
      v-model="refLicenseText.link"
      label-visible
      hint="max 50 caractères"
      label="ou lien URL de la licence"
    />
  </DsfrModal>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { LicenseText, Tag } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"

const emits = defineEmits([
  "next",
  "close",
  "previous",
  "update:tag",
  "update:license-text",
])
const props = defineProps({
  licenseText: { type: Object as PropType<LicenseText>, required: true },
  tags: { type: Array as PropType<number[]>, required: true },
  fullTags: { type: Array as PropType<Tag[]>, required: true },
  proprietary: { type: Boolean, default: false },
})

const tagStore = useTagStore()
const category = tagStore.categoryBySlug("license_03other")
const refLicenseText = useModel<LicenseText>("licenseText", { type: "object" })
const refTags = useModel<number[]>("tags", { type: "array" })

const isValid = computed<boolean>(
  () =>
    !!(refLicenseText.value?.file || refLicenseText.value?.link) &&
    (props.proprietary ||
      props.fullTags.findIndex((tag) => tag.category === category?.id) !== -1)
)

const title = computed<string>(() =>
  props.proprietary ? "Licence propriétaire" : "Autre licence"
)

const isFocused = ref<boolean>(false)
const actions = computed(() => [
  {
    label: "Suivant",
    secondary: true,
    onClick: () => emits("next"),
    icon: "ri-arrow-right-s-line",
    iconRight: true,
    disabled: !isValid.value,
  },
  {
    label: "Précédent",
    secondary: true,
    onClick: () => emits("previous"),
    icon: "ri-arrow-left-s-line",
  },
])
</script>

<style scoped lang="sass"></style>
