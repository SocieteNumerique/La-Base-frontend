<template>
  <DsfrModal title="Connexion" :opened="true" @close="emit('close')">
    <AuthLoginForm @done="emit('close')" @close="emit('close')" />
  </DsfrModal>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"])
</script>
