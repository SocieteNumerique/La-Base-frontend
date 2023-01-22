<template>
  <div
    style="color: var(--text-title-grey)"
    class="fr-py-3w"
    :style="borderTop ? 'border-top: 1px solid var(--border-default-grey)' : ''"
  >
    <div style="display: flex; justify-content: space-between" class="fr-mb-1w">
      <div class="fr-text--sm fr-m-0">{{ recommendation.user }}</div>
      <div class="fr-text--xs fr-m-0 fr-text-default--grey">
        {{ recommendation.date }}
      </div>
    </div>
    <div v-if="recommendation.userTags?.length">
      <DsfrTags :tags="tags" class="fr-tags-group--sm" />
    </div>
    <div class="fr-mb-3v" style="display: flex; justify-content: space-between">
      <div :style="canDelete ? 'padding-top: 3px' : ''">
        <RecommendationEvaluationLabel :recommendation="recommendation" />
      </div>
      <div v-if="props.canDelete">
        <div class="fr-btns-group--xs">
          <button
            class="fr-btn--tertiary-no-outline fr-py-1v fr-px-2w"
            @click="confirmDelete"
          >
            <VIcon :scale="0.8" class="fr-mr-1v" name="ri-delete-bin-line" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
    <p class="fr-text--sm fr-m-0">
      {{ recommendation.comment }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { Evaluation, Recommendation } from "~/composables/types"
import { PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { useEvaluationStore } from "~/stores/evaluationStore"
import { useConfirm } from "~/composables/useConfirm"
import { doNothing } from "~/composables/utils"

const evaluationStore = useEvaluationStore()
const tagStore = useTagStore()

const emit = defineEmits(["delete"])
const confirm = useConfirm()

const props = defineProps({
  borderTop: {
    type: Boolean,
    default: false,
  },
  recommendation: {
    type: Object as PropType<Recommendation | Evaluation>,
    required: true,
  },
  canDelete: { type: Boolean, default: false },
})
const isEvaluation = props.recommendation.isPositive == null
const confirmDelete = () => {
  confirm(
    "Êtes-vous sûr de vouloir supprimer votre recommandation ? Cette action est irréversible.",
    `Supprimer ${isEvaluation ? "l'évaluation" : "la recommandation"}`,
    "Supprimer",
    deleteRecommendation,
    doNothing
  )
}
const showDeleteConfirmation = ref(false)
let tags = []
if (props.recommendation.userTags?.length) {
  tags = props.recommendation.userTags
    .map((tagId) => tagStore.tagsById[tagId])
    .map((tag) => ({ label: tag.name }))
}

const deleteRecommendation = async () => {
  if (!props.recommendation.resource) {
    return
  }
  const { error } = await evaluationStore.removeRecommendation(
    props.recommendation.resource
  )
  if (!error.value) {
    showDeleteConfirmation.value = false
    emit("delete")
  }
}
</script>
