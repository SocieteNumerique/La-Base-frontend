<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    title="Signalement"
    @close="$emit('close')"
  >
    <DsfrSelect
      v-model="report.motive"
      :options="reportMotivesOptions"
      label="Motif du signalement"
      required
    />
    <DsfrInput
      v-model="report.description"
      is-textarea
      label="Description"
      label-visible
      required
    />
  </DsfrModal>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import { useApiPost } from "~/composables/api"

type Report = {
  id: number
  description: string
  instanceType: string
  motive: string
}
const emits = defineEmits(["close"])
const props = defineProps({
  instanceType: {
    type: String as PropType<"Resource" | "Base">,
    required: true,
  },
  id: { type: Number, required: true },
})

const report = ref<Report>({
  id: props.id,
  description: "",
  instanceType: props.instanceType,
  motive: "",
})

async function sendReport() {
  const { error } = await useApiPost(
    "reports/",
    report.value,
    {},
    "Signalement envoyé aux administrateurs",
    true
  )
  if (!error.value) emits("close")
}

const reportMotivesOptions = [
  {
    value: "",
    text: "-",
  },
  {
    // value: "inappropriate",
    text: "Le contenu est inapproprié",
    value: "Le contenu est inapproprié",
  },
  {
    // value: "obsolete",
    text: "Le contenu est obsolète",
    value: "Le contenu est obsolète",
  },
  {
    // value: "duplicate",
    text: "C'est le doublon d'une autre ressource",
    value: "C'est le doublon d'une autre ressource",
  },
  {
    // value: "error",
    text: "Il y a des erreurs",
    value: "Il y a des erreurs",
  },
]
const actions = computed(() => [
  {
    label: "Signaler",
    onClick: sendReport,
    disabled: !report.value.description || !report.value.motive,
  },
])
</script>
