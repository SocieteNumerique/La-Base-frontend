<template>
  <div style="display: flex" class="fr-mt-1v fr-text--sm fr-mb-0">
    <div style="width: 40px; text-align: right">{{ pct }} %</div>
    <div class="fr-px-2w" style="flex-grow: 1; padding-top: 8px">
      <div style="background: #f6f6f6; border-radius: 10px; height: 10px">
        <div
          style="border-radius: 10px; height: 100%"
          :style="`width: ${pct}%; background: ${color}`"
        ></div>
      </div>
    </div>
    <div style="width: 167px">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import { COLORS_PER_GRADE, evaluationGrades } from "~/composables/constants"

const props = defineProps({
  pct: { type: Number, required: true },
  grade: { type: String, required: true },
})

const color = COLORS_PER_GRADE[props.grade]
const label = evaluationGrades[parseInt(props.grade)]
</script>
