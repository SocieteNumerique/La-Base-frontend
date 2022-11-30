<template>
  <DsfrModal
    :actions="actions"
    :title="title"
    :opened="true"
    @close="emit('close')"
  >
    <div class="is-flex flex-center">
      <div class="sm-container">
        <template v-if="step === 'creation'">
          <DsfrInputGroup
            :error-message="emailErrorMessage"
            :is-invalid="!isMailValid"
            :label-visible="true"
            :model-value="email"
            label="Courriel"
            placeholder="jean@fournisseur.fr"
            style="margin-bottom: 16px"
            @update:model-value="onEmailUpdate"
          />
          <DsfrInputGroup
            :error-message="firstNameErrorMessage"
            :is-invalid="!isFirstNameValid"
            :label-visible="true"
            :model-value="firstName"
            label="Prénom"
            placeholder="Michel"
            type="type"
            style="margin-bottom: 16px"
            @update:model-value="firstNameUpdate"
          />
          <DsfrInputGroup
            :error-message="lastNameErrorMessage"
            :is-invalid="!isLastNameValid"
            :label-visible="true"
            :model-value="lastName"
            label="Nom"
            placeholder="Dupont"
            type="type"
            style="margin-bottom: 16px"
            @update:model-value="lastNameUpdate"
          />
          <DsfrInputGroup
            :error-message="passwordErrorMessage"
            :is-invalid="!isPasswordValid"
            :label-visible="true"
            :model-value="password"
            label="Mot de passe"
            placeholder="******"
            type="password"
            style="margin-bottom: 16px"
            @update:model-value="onPasswordUpdate"
          />
          <DsfrInputGroup
            :error-message="passwordConfirmationErrorMessage"
            :is-invalid="!isPasswordConfirmationValid"
            :label-visible="true"
            :model-value="passwordConfirmation"
            label="Confirmation du mot de passe"
            placeholder="******"
            type="password"
            style="margin-bottom: 16px"
            @update:model-value="onPasswordConfirmationUpdate"
          />
          <TagSelector
            :is-focused="focusedCategory === 'externalProducer_00occupation'"
            :category="tagStore.categoryBySlug('externalProducer_00occupation')"
            source="own"
            @focus="focusCategory('externalProducer_00occupation')"
            @blur="focusCategory('')"
            @change="onParticipantTagsChange"
          />
          <TagSelector
            :is-focused="focusedCategory === 'territory_00city'"
            :category="tagStore.categoryBySlug('territory_00city')"
            source="own"
            @focus="focusCategory('territory_00city')"
            @blur="focusCategory('')"
            @change="onTerritoryTagsChange"
          />
        </template>
        <template v-else>
          <div>
            <UserPolicyContent />
          </div>
          <DsfrCheckbox v-model="isPolicyChecked" :label="checkboxLabel" />
        </template>
      </div>
    </div>
  </DsfrModal>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useLoadingStore } from "~/stores/loadingStore"
import { useTagStore } from "~/stores/tagStore"
import { Tag } from "~/composables/types"

const emit = defineEmits(["close"])
const tagStore = useTagStore()
const step = ref("creation")
const isPolicyChecked = ref(false)

const title = computed(() =>
  step.value === "creation"
    ? "Créer un compte"
    : "Accepter la charte de la base"
)

// tags handling
const focusedCategory = ref("")
const participantSelectedTags = ref<number[]>([])
const territorySelectedTags = ref<number[]>([])
const selectedTags = computed(() => [
  ...participantSelectedTags.value,
  ...territorySelectedTags.value,
])
const focusCategory = (category: string) => (focusedCategory.value = category)
const onParticipantTagsChange = (tags: Tag[]) => {
  participantSelectedTags.value = tags.map((tag) => tag.id)
}
const onTerritoryTagsChange = (tags: Tag[]) => {
  territorySelectedTags.value = tags.map((tag) => tag.id)
}

// form handling
const email = ref("")
const isEmailUntouched = ref(true)
const isPasswordUntouched = ref(true)
const isPasswordConfirmationUntouched = ref(true)
const isFirstNameUntouched = ref(true)
const isLastNameUntouched = ref(true)
const emailErrorMessage = ref("")
const passwordErrorMessage = ref("")
const firstNameErrorMessage = ref("")
const lastNameErrorMessage = ref("")
const passwordConfirmationErrorMessage = ref("")
const password = ref("")
const passwordConfirmation = ref("")
const firstName = ref("")
const lastName = ref("")
const userStore = useUserStore()
const loadingStore = useLoadingStore()

const checkboxLabel =
  "En m'inscrivant, j'accepte les conditions d'utilisation et je m'engage à respecter les cadres juridiques (conditions d'utilisation et de partage notamment) associés à chaque ressource."

const actions = computed(() => {
  if (step.value === "creation") {
    return [
      {
        label: "Créer mon compte",
        onClick: () => (step.value = "policy"),
        disabled: !isFormValid.value || loadingStore.isLoading("authLogin"),
      },
      { label: "Annuler", onClick: () => emit("close"), secondary: true },
    ]
  } else {
    return [
      {
        label: "OK",
        onClick: submit,
        disabled: !isPolicyChecked.value,
      },
      {
        label: "Retour",
        onClick: () => (step.value = "creation"),
        secondary: true,
      },
    ]
  }
})

const onEmailUpdate = (value: string) => {
  isEmailUntouched.value = false
  email.value = value
}
const onPasswordUpdate = (value: string) => {
  isPasswordUntouched.value = false
  password.value = value
}
const firstNameUpdate = (value: string) => {
  isFirstNameUntouched.value = false
  firstName.value = value
}
const lastNameUpdate = (value: string) => {
  isLastNameUntouched.value = false
  lastName.value = value
}
const onPasswordConfirmationUpdate = (value: string) => {
  isPasswordConfirmationUntouched.value = false
  passwordConfirmation.value = value
}
const isMailValid = computed(() => {
  if (isEmailUntouched.value) {
    return true
  }

  if (!email.value.includes("@")) {
    emailErrorMessage.value = "Le courriel doit contenir @"
    return false
  }

  emailErrorMessage.value = ""

  return true
})
const isPasswordValid = computed(() => {
  if (isPasswordUntouched.value) {
    return true
  }

  if (password.value.length < 8) {
    passwordErrorMessage.value =
      "Le mot de passe doit contenir au moins 8 caractères"
    return false
  }

  passwordErrorMessage.value = ""
  return true
})
const isPasswordConfirmationValid = computed(() => {
  if (isPasswordConfirmationUntouched.value) {
    return true
  }
  const toReturn = passwordConfirmation.value === password.value
  if (!toReturn) {
    passwordConfirmationErrorMessage.value =
      "Les mots de passe ne correspondent pas"
  } else {
    passwordConfirmationErrorMessage.value = ""
  }
  return toReturn
})
const isFirstNameValid = computed(() => {
  if (isFirstNameUntouched.value) {
    return true
  }

  const toReturn = firstName.value.length >= 2
  if (!toReturn) {
    firstNameErrorMessage.value =
      "Le prénom doit avoir au moins deux caractères"
  } else {
    firstNameErrorMessage.value = ""
  }
  return toReturn
})
const isLastNameValid = computed(() => {
  if (isLastNameUntouched.value) {
    return true
  }

  const toReturn = lastName.value.length >= 2
  if (!toReturn) {
    lastNameErrorMessage.value =
      "Le nom de famille doit avoir au moins deux caractères"
  } else {
    lastNameErrorMessage.value = ""
  }
  return toReturn
})
const isFormValid = computed(() => {
  return (
    isMailValid.value &&
    isPasswordValid.value &&
    isPasswordConfirmationValid.value &&
    isFirstNameValid.value &&
    isLastNameValid.value &&
    !isEmailUntouched.value &&
    !isPasswordUntouched.value &&
    !isPasswordConfirmationUntouched.value &&
    !isFirstNameUntouched.value &&
    !isLastNameUntouched.value
  )
})
const submit = async () => {
  console.log("submit", email.value, password.value)
  const { error } = await userStore.signup({
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    password: password.value,
    tags: selectedTags.value,
  })
  if (!error.value) {
    emit("close")
  }
}
</script>
