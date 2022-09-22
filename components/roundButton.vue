<template>
  <button class="fr-btn fr-btn--secondary btn--no-border fr-btn--icon-left">
    <span class="fr-mr-3v">
      <VIcon :scale="0.9" :name="props.icon" />
    </span>
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: { type: String, required: true },
  label: { type: String, default: "" },
})
</script>

<style scoped>
.fr-btn {
  font-weight: 400;
}
.fr-btn span {
  border: 1px solid var(--text-action-high-blue-france);
  display: inline-block;
  border-radius: 100%;
  width: 30px;
  height: 30px;
  padding-top: 1px;
}
.fr-btn:disabled span {
  border: 1px solid var(--text-disabled-grey);
}
</style>
