<template>
  <div
    class="fr-input-group"
    :class="{
      'fr-input-group--error': errorMessage,
      'fr-input-group--valid': validMessage,
    }"
  >
    <slot />
    <FormRichTextInput
      v-model="modelValue"
      v-bind="$attrs"
      :is-valid="!!validMessage"
      :is-invalid="!!errorMessage"
      :label="label"
      :hint="hint"
      :placeholder="placeholder"
    ></FormRichTextInput>
    <p v-if="message" :id="descriptionId" :class="messageClass">
      <span>{{ message }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: {
    type: String,
    default: undefined,
  },
  descriptionId: {
    type: String,
    default() {
      return generateRandomId()
    },
  },
  label: {
    type: String,
    default: "",
  },
  hint: {
    type: String,
    default: "",
  },
  labelVisible: Boolean,
  modelValue: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: "Placeholder",
  },
  errorMessage: {
    type: String,
    default: undefined,
  },
  validMessage: {
    type: String,
    default: undefined,
  },
})

const modelValue = useModel<string>("modelValue")

const message = computed(() => {
  return props.errorMessage || props.validMessage
})
const messageClass = computed(() => {
  return props.errorMessage ? "fr-error-text" : "fr-valid-text"
})
</script>
