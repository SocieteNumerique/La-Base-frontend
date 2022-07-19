<template>
  <DsfrModal title="" :actions="buttons" opened @close="$emit('close')">
    <TagSelector
      :category="priceTagCategory"
      :is-focused="isFocused"
      :init-tags="tags"
      source="ownId"
      label="Prix"
      @blur="isFocused = false"
      @change="setAndMergeTags"
      @focus="isFocused = true"
    />
    <TagRadioSelector
      :category="accessTagCategory"
      :init-tags="tags"
      source="ownId"
      label="Accès"
      @change="setAndMergeTags"
    />
  </DsfrModal>
</template>

<script setup lang="ts">
import { useTagStore } from "~/stores/tagStore"
import { PropType } from "vue"
import { Tag, TagCategory } from "~/composables/types"

const tagStore = useTagStore()
const emits = defineEmits(["save", "close", "update:model-value", "previous"])
const props = defineProps({
  modelValue: { type: Array as PropType<number[]>, required: true },
  fullTags: { type: Array as PropType<Tag[]>, required: true },
})

const accessTagCategory = tagStore.categoryBySlug("license_04access")
const priceTagCategory = tagStore.categoryBySlug("license_00price")
const tags = useModel<number[]>("modelValue", { type: "array" })

function setAndMergeTags(updatedTags: number[]) {
  tags.value = [...new Set([...updatedTags, ...tags.value])]
}

const isValid = computed<boolean>(
  () =>
    props.fullTags.findIndex(
      (tag) => tag.category === accessTagCategory?.id
    ) !== -1 &&
    props.fullTags.findIndex((tag) => tag.category === priceTagCategory?.id) !==
      -1
)

const isFocused = ref<boolean>(false)
const buttons = computed(() => [
  {
    label: "Valider",
    onClick: () => emits("save"),
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
