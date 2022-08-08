<template>
  <DsfrModal title="Licence" :actions="actions" opened @close="$emit('close')">
    <TagSelector
      :category="priceTagCategory"
      :is-focused="isFocused"
      :init-tags="tags"
      source="ownId"
      label="Prix"
      @blur="isFocused = false"
      @change="setAndMergeTags($event, priceTagCategory)"
      @focus="isFocused = true"
    />
    <TagRadioSelector
      :category="accessTagCategory"
      :init-tags="tags"
      source="ownId"
      label="Accès"
      allows-unknown
      @change="setAndMergeTags($event, accessTagCategory)"
    />
    <DsfrRadioButtonSet
      v-model="refLicenseKnowledge"
      name="is-license-known"
      :inline="true"
      :options="specificLicenseRadioOptions"
      legend="Ce contenu est-il soumis à une licence spécifique ?"
      class="fr-text--regular"
    />
  </DsfrModal>
</template>

<script setup lang="ts">
import { useTagStore } from "~/stores/tagStore"
import { PropType } from "vue"
import { LicenseKnowledge, Tag, TagCategory } from "~/composables/types"

const tagStore = useTagStore()
const emits = defineEmits(["next", "close", "update:is-license-known", "save"])
defineProps({
  modelValue: { type: Array as PropType<number[]>, required: true },
  licenseKnowledge: {
    type: String as PropType<LicenseKnowledge>,
    default: "unknown",
  },
  fullTags: { type: Array as PropType<Tag[]>, required: true },
})

const accessTagCategory = tagStore.categoryBySlug("license_04access")
const priceTagCategory = tagStore.categoryBySlug("license_00price")
const tags = useModel<number[]>("modelValue", { type: "array" })

const refLicenseKnowledge = useModel("licenseKnowledge")

const hasSpecificLicense = computed<boolean>(
  () => refLicenseKnowledge.value === "specific"
)

const isFocused = ref<boolean>(false)

function setAndMergeTags(updatedTags: number[], category?: TagCategory) {
  return tagStore.setTagsOfCategory(updatedTags, category!.id, tags.value)
}

const actions = computed(() =>
  hasSpecificLicense.value
    ? [
        {
          label: "Suivant",
          onClick: () => emits("next"),
          icon: "ri-arrow-right-s-line",
          iconRight: true,
        },
      ]
    : [
        {
          label: "Valider",
          onClick: () => emits("save"),
        },
      ]
)
const specificLicenseRadioOptions = [
  {
    label: "Inconnu",
    value: "unknown",
  },
  {
    label: "Oui",
    value: "specific",
  },
  { label: "Non", value: "resource" },
]
</script>

<style lang="sass">
.fr-btn.reverse
  flex-direction: row-reverse !important
</style>
