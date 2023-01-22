<template>
  <div>
    <div style="display: inline-block">
      <div
        v-if="recommendation.criterion"
        class="recommendation-dot fr-mr-1w"
        :style="`background: ${evaluationColors[recommendation.evaluation]}`"
        style="display: inline-block"
      ></div>
      <VIcon
        v-else
        :name="recommendation.isPositive ? 'recommended' : 'not-recommended'"
        class="fr-mr-2v"
      />
    </div>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { evaluationGrades } from "~/composables/constants"
import { PropType } from "vue"
import { Evaluation, Recommendation } from "~/composables/types"
import { evaluationColors } from "~/composables/constants"

const props = defineProps({
  recommendation: {
    type: Object as PropType<Recommendation | Evaluation>,
    required: true,
  },
})
let label = ""
if (props.recommendation.criterion) {
  label = evaluationGrades[props.recommendation.evaluation]
} else {
  label = props.recommendation.isPositive ? "Recommandée" : "Non recommandée"
}
</script>

<style>
.recommendation-dot {
  width: 18px;
  height: 18px;
  border-radius: 18px;
  position: relative;
  top: 2px;
}
</style>
