<template>
  <div>
    <div style="display: inline-block">
      <div
        v-if="evaluation.criterion !== RECOMMENDATION_CRITERION"
        class="evaluation-dot fr-mr-1w"
        :style="`background: ${evaluationColors[evaluation.evaluation]}`"
        style="display: inline-block"
      ></div>
      <VIcon
        v-else
        :name="evaluation.evaluation === 0 ? 'not-recommended' : 'recommended'"
        class="fr-mr-2v"
      />
    </div>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { evaluationGrades } from "~/composables/constants"
import { PropType } from "vue"
import { Evaluation } from "~/composables/types"
import { evaluationColors } from "~/composables/constants"
import { RECOMMENDATION_CRITERION } from "~/composables/constants"

const props = defineProps({
  evaluation: {
    type: Object as PropType<Evaluation>,
    required: true,
  },
})
let label = ""
if (props.evaluation.criterion !== RECOMMENDATION_CRITERION) {
  label = evaluationGrades[props.evaluation.evaluation]
} else {
  label = props.evaluation.evaluation === 0 ? "Non recommandée" : "recommandée"
}
</script>

<style>
.evaluation-dot {
  width: 18px;
  height: 18px;
  border-radius: 18px;
  position: relative;
  top: 2px;
}
</style>
