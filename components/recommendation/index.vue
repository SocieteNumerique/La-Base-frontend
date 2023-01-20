<template>
  <div
    style="
      color: var(--text-title-grey);
      border-top: 1px solid var(--border-default-grey);
    "
    class="fr-py-3w"
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
        <VIcon
          :name="recommendation.isPositive ? 'recommended' : 'not-recommended'"
          class="fr-mr-2v"
        />
        {{ recommendation.isPositive ? "Recommandée" : "Non recommandée" }}
      </div>
      <div v-if="props.canDelete">
        <div class="fr-btns-group--xs">
          <button
            class="fr-btn--tertiary-no-outline fr-py-1v fr-px-2w"
            @click="deleteRecommendation"
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
import { Recommendation } from "~/composables/types"
import { PropType } from "vue"
import { useTagStore } from "~/stores/tagStore"
import { useEvaluationStore } from "~/stores/evaluationStore"

const evaluationStore = useEvaluationStore()
const tagStore = useTagStore()

const emit = defineEmits(["delete"])

const props = defineProps({
  recommendation: { type: Object as PropType<Recommendation>, required: true },
  canDelete: { type: Boolean, default: false },
})
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
    emit("delete")
  }
}
</script>
