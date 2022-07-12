<template>
  <DsfrAlert
    class="alert-display"
    :title="alert.title"
    :description="small ? alert.text : alert.title"
    :type="alert.type"
    :small="small"
    closeable
    @close="$emit('close')"
  />
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Alert } from "~/composables/types"

const props = defineProps({
  alert: { type: Object as PropType<Alert>, required: true },
})
defineEmits(["close"])
const small = computed<boolean>(() => !!(props.alert.text && props.alert.title))
</script>

<style scoped lang="sass">
@keyframes slidein
  from
    margin-left: 100vh
  to
    margin-left: auto
.alert-display
  background: white
  width: 345px
  margin-left: 100vh
  z-index: 10000000
  animation: 300ms ease-in-out slidein
</style>
