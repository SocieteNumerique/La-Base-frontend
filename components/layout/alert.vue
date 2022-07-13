<template>
  <DsfrAlert
    class="alert-display"
    :title="small ? undefined : alert.title"
    :description="small ? alert.text || alert.title : alert.text"
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
const small = computed<boolean>(() => !(props.alert.text && props.alert.title))
</script>

<style scoped lang="sass">
@keyframes slidein
  from
    margin-right: -100vh
  to
    margin-right: 0
.alert-display
  background: white
  width: fit-content
  max-width: 500px
  animation: 300ms ease-in-out slidein forwards
</style>
