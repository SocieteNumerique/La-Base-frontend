<template>
  <DsfrModal title="Licence" :actions="actions" opened @close="$emit('close')">
    <p>
      Si vous avez produit la ressource sans avoir encore défini une license,
      nous vous invitons à choisir une licence libre dans la liste ci-dessous.
      Si cette ressource n’a pas été produite par vous, merci de vous assurer de
      la license sous laquelle celle-ci a été diffusée avant de continuer le
      renseignement.
    </p>
    <TagSelector
      :category="category"
      :is-focused="isFocused"
      :init-tags="tags"
      source="ownId"
      label=""
      @blur="isFocused = false"
      @change="tags = $event"
      @focus="isFocused = true"
    />
  </DsfrModal>
</template>

<script setup lang="ts">
import { useTagStore } from "~/stores/tagStore"
import { PropType } from "vue"
import { Tag } from "~/composables/types"

const tagStore = useTagStore()
const emits = defineEmits(["next", "close"])
const props = defineProps({
  modelValue: { type: Array as PropType<number[]>, required: true },
  fullTags: { type: Array as PropType<Tag[]>, required: true },
})

const category = tagStore.categoryBySlug("license_01license")
const tags = useModel<number[]>("modelValue", { type: "array" })

const isValid = computed<boolean>(
  () => props.fullTags.findIndex((tag) => tag.category === category?.id) !== -1
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
])
</script>

<style scoped lang="sass"></style>
