<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    title="Signaler la base"
    @close="$emit('close')"
  >
    <p class="fr-text--sm">
      Veuillez indiquez un motif de signalement et le préciser dans votre
      message.
    </p>
    <DsfrSelect
      v-model="report.motive"
      :options="reportMotivesOptions"
      label="Motif du signalement"
      required
    />
    <DsfrInput
      v-model="report.description"
      :is-textarea="true"
      :label-visible="true"
      placeholder="Votre texte ici"
      maxlength="280"
    >
      <template #label>
        Votre texte ici
        <span class="fr-hint-text">
          Vous pouvez précisez votre signalement ici. Pour envoyer un fichier,
          utilisez un service externe comme fromsmash.com ou wetransfer.com.
        </span>
      </template>
    </DsfrInput>
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
    "report",
    report.value,
    {},
    "Signalement envoyé aux administrateurs",
    true
  )
  if (!error.value) emits("close")
}

const reportMotivesOptions =
  props.instanceType === "Resource"
    ? [
        {
          value: "",
          text: "Sélectionnez une option",
        },
        {
          text: "Le contenu est inapproprié",
          value: "Le contenu est inapproprié",
        },
        {
          text: "Le contenu est obsolète",
          value: "Le contenu est obsolète",
        },
        {
          text: "C'est le doublon d'une autre ressource",
          value: "C'est le doublon d'une autre ressource",
        },
        {
          text: "Il y a des erreurs",
          value: "Il y a des erreurs",
        },
      ]
    : [
        {
          value: "",
          text: "Sélectionnez une option",
        },
        {
          text: "Le contenu est inapproprié",
          value: "Le contenu est inapproprié",
        },
        {
          text: "Le contenu est obsolète",
          value: "Le contenu est obsolète",
        },
        {
          text: "C'est le doublon d'une autre base",
          value: "C'est le doublon d'une autre base",
        },
        {
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
