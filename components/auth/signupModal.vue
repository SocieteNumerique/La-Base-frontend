<template>
  <DsfrModal
    :actions="actions"
    title="Créer un compte"
    :opened="true"
    @close="emit('close')"
  >
    <div class="is-flex flex-center">
      <div class="sm-container">
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
      </div>
    </div>
  </DsfrModal>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useLoadingStore } from "~/stores/loadingStore"
import { DsfrInputGroup, DsfrModal } from "@laruiss/vue-dsfr"

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

const emit = defineEmits(["close"])
const actions = computed(() => [
  {
    label: "Connexion",
    onClick: submit,
    disabled: !isFormValid.value || loadingStore.isLoading("authLogin"),
  },
  { label: "Annuler", onClick: () => emit("close"), secondary: true },
])

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
  console.log("### is form valid ?", isEmailUntouched.value)
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
  })
  if (!error.value) {
    emit("close")
  }
}
</script>
