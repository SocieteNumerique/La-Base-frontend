<template>
  <DsfrModal
    :actions="actions"
    :opened="true"
    :title="title"
    @close="$emit('close')"
  >
    <div v-if="step == 'choice'">
      <p>
        Si vous souhaitez contribuer à la fiche ou bien en récupérer
        l’administration, vous pouvez envoyer une demande via cette fenêtre.
      </p>
      <DsfrRadioButtonSet
        v-model="contributeChoice"
        name="contributeChoice"
        label="Choix de la contribution souhaitée"
        legend="Vous souhaitez"
        :options="contributeOptions"
        required="true"
      />
      <p>{{ detail }}</p>
    </div>
    <div v-else>
      <p>{{ detail }}</p>
      <DsfrInput
        v-model="message"
        :is-textarea="true"
        hint="Merci de précisez votre demande au propriétaire de la fiche"
        label="Votre demande"
        :label-visible="true"
      />
      <BaseSelector
        v-if="step === 'administrator'"
        v-model="selectedBaseForAdministration"
        label="Votre base administratrice"
        description="Sélectionner, parmi vos bases, celle dans laquelle vous souhaitez administrer cette ressource. Vous devez impérativement posséder une base pour faire cette demande."
        class="fr-mt-4w"
      />
    </div>
  </DsfrModal>
</template>

<script setup lang="ts">
import { DsfrInput, DsfrRadioButtonSet } from "@gouvminint/vue-dsfr"
import { useApiPost } from "~/composables/api"

const props = defineProps({
  id: { type: Number, required: true },
})
const emit = defineEmits(["close"])

type Contribution = "suggestion" | "contributor" | "administrator"
type ContributeType = Contribution | "choice"
type ContributeTypeOrEmpty = Contribution | ""

const message = ref("")
const step = ref<ContributeType>("choice")
const contributeChoice = ref<ContributeTypeOrEmpty>("")
const selectedBaseForAdministration = ref<null | number>(null)

const title = computed(() => {
  return {
    choice: "Contribuer",
    suggestion: "Faire une suggestion",
    contributor: "Devenir contributeur",
    administrator: "Devenir l'administrateur",
  }[step.value]
})

const contributeOptions = [
  { label: "faire une suggestion", value: "suggestion" },
  { label: "devenir contributeur", value: "contributor" },
  { label: "devenir l'administrateur", value: "administrator" },
]
const actions = computed(() => {
  if (step.value == "choice") {
    return [
      {
        label: "Suivant",
        onClick: nextStep,
        disabled: contributeChoice.value === "",
      },
      { label: "Annuler", onClick: () => emit("close"), secondary: true },
    ]
  }
  return [
    {
      label: "Envoyer",
      onClick: submit,
      icon: "ri-mail-line",
      disabled:
        step.value === "administrator" &&
        selectedBaseForAdministration.value == null,
    },
    { label: "Annuler", onClick: () => emit("close"), secondary: true },
  ]
})

const detail = computed(() => {
  return {
    "": "",
    suggestion:
      "Vous pouvez contribuer à l’amélioration de cette fiche en partageant des suggestions à l’auteur.",
    contributor:
      "Vous pouvez demander à l’auteur de vous ouvrir les droits d’édition d’en devenir co-éditeur.",
    administrator:
      "Vous pouvez demander à récupérer l’administration de la fiche ressource à son auteur, par exemple dans le cas où vous êtes le producteur de la ressource. Vous devez posséder au moins une base pour pouvoir faire cette demande.",
  }[contributeChoice.value]
})

const nextStep = () => {
  step.value = <Contribution>contributeChoice.value
}
const submit = async () => {
  const { error } = await useApiPost(
    "contribute",
    {
      id: props.id,
      message: message.value,
      targetBase: selectedBaseForAdministration.value,
      contributeChoice: contributeChoice.value,
    },
    {},
    "La demande a bien été envoyée",
    { title: "Erreur lors du transfert de la demande", text: "_responseBody" }
  )
  if (!error.value) {
    emit("close")
  }
}
</script>
