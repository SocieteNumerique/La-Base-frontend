<template>
  <DsfrModal title="Connexion" :opened="true" @close="emit('close')">
    <AuthLoginForm @done="emit('close')" @close="emit('close')" />
  </DsfrModal>
</template>

<script setup lang="ts">
import { DsfrModal } from "@laruiss/vue-dsfr"
const emit = defineEmits(["close"])
</script>
