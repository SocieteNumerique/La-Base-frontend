<template>
  <div>
    <button
      :aria-pressed="props.selected"
      :disabled="props.disabled"
      class="fr-tag"
    >
      <div>{{ props.label }}</div>
      <div v-if="props.tagCount != null" class="fr-text--xs fr-ml-1w fr-mr-1w">
        {{ props.tagCount }}
      </div>
      <VIcon :scale="0.9" name="ri-information-line"/>
      <slot/>
    </button>

    <GlossaryPreview :word="props.label" class="glossary-preview"/>
  </div>
</template>

<script lang="ts" setup>
import GlossaryPreview from "~/components/glossaryPreview.vue";

const props = defineProps({
  label: {type: String, default: ""},
  selected: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false},
  tagCount: {type: Number, default: null},
})
</script>

<style lang="sass" scoped>
@mixin display-glossary
  opacity: 1
  max-height: 100%
  transition: opacity 0.2s ease-in-out, max-height

.glossary-preview
  opacity: 0
  max-height: 0
  transition: opacity 0.2s ease-in-out 0.5s, max-height 0s linear 0.7s

  &:hover
    @include display-glossary

button.fr-tag
  display: flex
  align-items: center

  &:hover + .glossary-preview
    @include display-glossary

</style>
