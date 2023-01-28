<template>
  <div>
    <div v-if="evaluations.length">
      <div class="fr-mb-2w">
        <DsfrButton
          class="fr-btn--sm fr-btn--tertiary-no-outline fr-pl-0"
          icon="ri-arrow-right-line"
          :icon-right="true"
          @click="showEvaluationsModal = true"
          >{{ evaluationsLabel }}</DsfrButton
        >
      </div>

      <div v-if="isReco">
        <DsfrBadge
          :type="recommendationBadge.type"
          :label="recommendationBadge.label"
          :no-icon="true"
          :small="true"
        />
        <div class="fr-mt-2w">
          <VIcon class="fr-mr-2w" style="color: black" name="recommended" />
          Recommandée à {{ recommendPct }} %
        </div>
        <div class="fr-mt-2w">
          <VIcon class="fr-mr-2w" style="color: black" name="not-recommended" />
          Non recommandée à {{ 100 - recommendPct }} %
        </div>
      </div>

      <!-- is an evaluation-->
      <div v-else>
        <div>
          <EvaluationLine :pct="pct('4')" grade="4" />
          <EvaluationLine :pct="pct('3')" grade="3" />
          <EvaluationLine :pct="pct('2')" grade="2" />
          <EvaluationLine :pct="pct('1')" grade="1" />
          <EvaluationLine :pct="pct('0')" grade="0" />
        </div>
      </div>

      <div class="fr-my-4w">
        <template v-if="currentUserHasEvaluated">
          <span
            style="color: var(--text-default-success)"
            class="fr-text--sm fr-m-0"
          >
            {{ isReco ? "Recommandé" : "Évalué" }}
            <VIcon name="ri-check-line" class="fr-ml-1w" />
          </span>
          <DsfrButton
            :label="`Voir ${isReco ? 'ma recommandation' : 'mon évaluation'}`"
            class="fr-btn--tertiary-no-outline fr-btn--sm fr-ml-1w"
            icon="ri-arrow-right-line"
            :icon-right="true"
            @click="showMyEvaluation"
          />
        </template>
        <template v-else>
          <template v-if="isReco">
            <div>Recommendez-vous cette ressource ?</div>
            <div style="display: flex" class="fr-mt-2w">
              <button
                class="fr-btn fr-btn--sm fr-mr-2w"
                @click="emit('recommend')"
              >
                <VIcon name="recommended" class="fr-mr-1w" />
                Oui
              </button>
              <button
                class="fr-btn fr-btn--secondary fr-btn--sm"
                @click="emit('not-recommend')"
              >
                <VIcon name="not-recommended" class="fr-mr-1w" />
                Non
              </button>
            </div>
          </template>
          <template v-else>
            <button
              class="fr-btn fr-btn--sm fr-mr-2w"
              @click="emit('evaluate')"
            >
              <VIcon name="ri-equalizer-line" class="fr-mr-1w" />
              Évaluer
            </button>
          </template>
        </template>
      </div>
    </div>
    <div
      v-else
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      "
    >
      <p class="fr-m-0 fr-text--sm">
        {{
          isReco ? "Aucune recommendation" : "Aucune évaluation pour ce critère"
        }}
      </p>
    </div>
    <DsfrModal
      v-if="showEvaluationsModal"
      :opened="true"
      :title="criterion.name"
      @close="resetModal"
    >
      <p>
        {{ criterion.description }}
      </p>
      <Evaluation
        v-if="showOnlyOwnEvaluation"
        :evaluation="ownEvaluation"
        @delete="onEvaluationDelete"
      />
      <template v-else>
        <template v-for="(evaluation, ix) of evaluations" :key="ix">
          <hr />
          <Evaluation :evaluation="evaluation" @delete="onEvaluationDelete" />
        </template>
      </template>
    </DsfrModal>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue"
import { Criterion, Evaluation as EvaluationType } from "~/composables/types"
import { RECOMMENDATION_CRITERION } from "~/composables/constants"
import { pluralize } from "~/composables/strUtils"

const props = defineProps({
  grades: { type: Object as PropType<Record<string, number>>, required: true },
  evaluations: { type: Array as PropType<EvaluationType[]>, required: true },
  criterion: { type: Object as PropType<Criterion>, required: true },
})
const emit = defineEmits(["recommend", "not-recommend", "evaluate"])

const onEvaluationDelete = () => {
  resetModal()
}
const showEvaluationsModal = ref(false)
const showOnlyOwnEvaluation = ref(false)

const resetModal = () => {
  showEvaluationsModal.value = false
  showOnlyOwnEvaluation.value = false
}
const showMyEvaluation = () => {
  showOnlyOwnEvaluation.value = true
  showEvaluationsModal.value = true
}
const pct = (grade: string) => {
  return Math.round((props.grades[grade] / props.evaluations.length) * 100)
}

const recommendPct = computed(() => {
  return Math.round((props.grades["1"] / props.evaluations.length) * 100)
})
const recommendationBadge = computed<{ label: string; type: string }>(() => {
  if (!isReco.value) {
    return { type: "success", label: "Très recommandée" }
  }
  if (recommendPct.value > 80) {
    return { type: "success", label: "Très recommandée" }
  }
  if (recommendPct.value > 60) {
    return { type: "new", label: "Recommandée" }
  }
  if (recommendPct.value > 40) {
    return { type: "new", label: "Moyennement recommandée" }
  }
  if (recommendPct.value > 20) {
    return { type: "warning", label: "Peu recommandée" }
  }
  return { type: "error", label: "Pas recommandée" }
})
const evaluationsLabel = computed(() => {
  return `Voir
  ${pluralize(["la", "les"], props.evaluations.length)}
  ${props.evaluations.length}
  ${pluralize(
    [isReco.value ? "recommendation" : "évaluation"],
    props.evaluations.length
  )}
  ${pluralize(["commentée"], props.evaluations.length)}`
})

const isReco = computed(() => {
  return props.criterion.slug == RECOMMENDATION_CRITERION
})
const currentUserHasEvaluated = computed(() => {
  return props.evaluations.filter((evaluation) => evaluation.isOwner).length
})
const ownEvaluation = computed(() => {
  return props.evaluations.filter((evaluation) => evaluation.isOwner)[0]
})
</script>
