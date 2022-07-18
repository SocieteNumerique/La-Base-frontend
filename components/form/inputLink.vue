<template>
  <DsfrInput
    v-model="link"
    :label-visible="labelVisible"
    :label="label"
    placeholder="https://"
    type="url"
  />
</template>

<script setup lang="ts">
// TODO use it in content/input/link
const props = defineProps({
  modelValue: { type: String, required: true },
  label: { type: String, default: null },
  labelVisible: { type: Boolean, default: false },
})
const emits = defineEmits(["update:modelValue"])

const link = computed<string>({
  get() {
    return props.modelValue
  },
  set(value) {
    if (/^https?:\/\/.*/.test(value)) emits("update:modelValue", value)
    emits("update:modelValue", `http://${value}`)
  },
})
</script>

<style scoped lang="sass"></style>
