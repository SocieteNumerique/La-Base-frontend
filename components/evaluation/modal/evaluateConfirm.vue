<template>
  <div>
    <Evaluation
      :evaluation="evaluation"
      :can-delete="true"
      @delete="$emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Evaluation as EvaluationType } from "~/composables/types"

defineEmits(["delete"])
defineProps({
  evaluation: {
    type: Object as PropType<EvaluationType>,
    required: true,
  },
})
</script>
