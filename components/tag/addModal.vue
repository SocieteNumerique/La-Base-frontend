<template>
  <DsfrModal :opened="true" :actions="actions" title="Ajouter un tag">
    <p>Ce tag apparaîtra pour l’ensemble des utilisateurs.</p>
    <DsfrInput
      :model-value="inputValue"
      label="Nom du nouveau tag"
      placeholder="Nouveau tag"
      :label-visible="true"
      @update:model-value="onInputUpdate"
    />
  </DsfrModal>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useTagStore } from "~/stores/tagStore"

const tagStore = useTagStore()

const props = defineProps({
  tagCategoryId: { type: Number, required: true },
})
const emit = defineEmits(["created"])

const addTag = async () => {
  const tagId = await tagStore.createTag(inputValue.value, props.tagCategoryId)
  emit("created", tagId)
}
const actions = [
  {
    label: "Ajouter un tag",
    onClick: addTag,
  },
]

const inputValue = ref("")

const onInputUpdate = (newValue: string) => {
  inputValue.value = newValue
}
</script>
