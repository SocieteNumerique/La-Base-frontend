<template>
  <DsfrModal title="Licence" :actions="actions" opened @close="$emit('close')">
    <p>
      Si vous avez produit la ressource sans avoir encore défini une license,
      nous vous invitons à choisir une licence libre dans la liste ci-dessous.
      Si cette ressource n’a pas été produite par vous, merci de vous assurer de
      la license sous laquelle celle-ci a été diffusée avant de continuer le
      renseignement.
    </p>
    <TagRadioSelector
      :category="licenseCategory"
      :is-focused="isFocused"
      :init-tags="tags"
      source="ownId"
      label=""
      @change="setAndMergeTags($event, licenseCategory)"
    />

    <TagSelector
      v-if="licenseType === 'free'"
      :category="freeTagsCategory"
      :is-focused="isFocused"
      :init-tags="tags"
      source="ownId"
      label="Licence libre"
      @blur="isFocused = false"
      @change="setAndMergeTags($event, freeTagsCategory)"
      @focus="isFocused = true"
    />
    <template v-else-if="licenseType">
      <DsfrInput
        v-if="licenseType === 'other'"
        :model-value="licenseText.name"
        label="Nom de la licence"
        label-visible
        class="fr-form-group"
        @update:model-value="refLicenseText = { ...licenseText, name: $event }"
      />
      <p v-if="licenseText?.file?.link">
        <a
          :href="licenseText.file.link"
          class="no-underline no-append-ico"
          rel="noopener noreferrer"
          target="_blank"
        >
          <VIcon name="ri-file-line" />
          {{ licenseText.file.name }}
        </a>
      </p>
      <FormFileUpload
        :label="`${
          licenseText?.file?.link ? 'Changer' : 'Ajouter'
        } le texte de la licence`"
        @update:model-value="
          refLicenseText = { ...refLicenseText, file: $event }
        "
      />
      <FormInputLink
        v-model="refLicenseText.link"
        label-visible
        hint="max 50 caractères"
        label="ou lien URL de la licence"
      />
    </template>
  </DsfrModal>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { LicenseText, Tag, TagCategory } from "~/composables/types"
import { useTagStore } from "~/stores/tagStore"

const emits = defineEmits([
  "save",
  "close",
  "previous",
  "update:tag",
  "update:licenseText",
])
defineProps({
  licenseText: { type: Object as PropType<LicenseText>, required: true },
  tags: { type: Array as PropType<number[]>, required: true },
  fullTags: { type: Array as PropType<Tag[]>, required: true },
  licenseType: {
    type: String as PropType<"free" | "proprietary" | "other" | undefined>,
    default: undefined,
  },
})

const tagStore = useTagStore()
const freeTagsCategory = tagStore.categoryBySlug("license_02free")
const licenseCategory = tagStore.categoryBySlug("license_01license")
const refLicenseText = useModel<LicenseText>("licenseText", { type: "object" })
const refTags = useModel<number[]>("tags", { type: "array" })

function setAndMergeTags(updatedTags: number[], category?: TagCategory) {
  return tagStore.setTagsOfCategory(updatedTags, category!.id, refTags.value)
}

const isFocused = ref<boolean>(false)
const actions = computed(() => [
  {
    label: "Valider",
    onClick: () => emits("save"),
  },
  {
    label: "Revenir",
    secondary: true,
    onClick: () => emits("previous"),
    icon: "ri-arrow-left-s-line",
  },
])
</script>
