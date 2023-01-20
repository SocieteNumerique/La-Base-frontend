<template>
  <div>
    <Recommendation
      :recommendation="recommendation"
      :can-delete="true"
      @delete="$emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Recommendation as RecommendationType } from "~/composables/types"

defineEmits(["delete"])
defineProps({
  recommendation: {
    type: Object as PropType<RecommendationType>,
    required: true,
  },
})
</script>
