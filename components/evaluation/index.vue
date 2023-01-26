<template>
  <div
    style="color: var(--text-title-grey)"
    class="fr-py-3w"
    :style="borderTop ? 'border-top: 1px solid var(--border-default-grey)' : ''"
  >
    <div style="display: flex; justify-content: space-between" class="fr-mb-1w">
      <div class="fr-text--sm fr-m-0">{{ evaluation.user }}</div>
      <div class="fr-text--xs fr-m-0 fr-text-default--grey">
        {{ evaluation.date }}
      </div>
    </div>
    <div v-if="evaluation.userTags?.length">
      <DsfrTags :tags="tags" class="fr-tags-group--sm" />
    </div>
    <div class="fr-mb-3v" style="display: flex; justify-content: space-between">
      <div :style="canDelete ? 'padding-top: 3px' : ''">
        <EvaluationLabel :evaluation="evaluation" />
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
      {{ evaluation.comment }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { Evaluation } from "~/composables/types"
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
  evaluation: {
    type: Object as PropType<Evaluation>,
    required: true,
  },
  canDelete: { type: Boolean, default: false },
})
const isEvaluation = props.evaluation.criterion !== "_recommendation"
const confirmDelete = () => {
  confirm(
    `Êtes-vous sûr de vouloir supprimer votre ${
      isEvaluation ? "évaluation" : "recommandation"
    } ? Cette action est irréversible.`,
    `Supprimer ${isEvaluation ? "l'évaluation" : "la recommandation"}`,
    "Supprimer",
    deleteEvaluation,
    doNothing
  )
}
const showDeleteConfirmation = ref(false)
let tags = []
if (props.evaluation.userTags?.length) {
  tags = props.evaluation.userTags
    .map((tagId) => tagStore.tagsById[tagId])
    .map((tag) => ({ label: tag.name }))
}

const deleteEvaluation = async () => {
  if (!props.evaluation.resource) {
    return
  }
  const { error } = await evaluationStore.removeEvaluation(
    props.evaluation.resource,
    props.evaluation.criterion!
  )

  if (!error.value) {
    showDeleteConfirmation.value = false
    emit("delete")
  }
}
</script>
