<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useLoadingStore } from "~~/stores/loadingStore"

const email = ref("")
const isEmailUntouched = ref(true)
const isPasswordUntouched = ref(true)
const emailErrorMessage = ref("")
const passwordErrorMessage = ref("")
const password = ref("")
const userStore = useUserStore()
const loadingStore = useLoadingStore()

const onEmailUpdate = (value: string) => {
  isEmailUntouched.value = false
  console.log("### onEmailUpdate", value)
  email.value = value
}
const onPasswordUpdate = (value: string) => {
  isPasswordUntouched.value = false
  console.log("### onPasswordUpdate", value)
  password.value = value
}
const isMailValid = computed(() => {
  if (isEmailUntouched.value) {
    return true
  }

  console.log("### ismailvalid?", email.value)

  if (!email.value.includes("@")) {
    emailErrorMessage.value = "Le courriel doit contenir @"
    return false
  }

  emailErrorMessage.value = ""
  console.log("### is valid")

  return true
})
const isPasswordValid = computed(() => {
  if (isPasswordUntouched.value) {
    return true
  }

  console.log("### isPasswordValid?", password.value)

  if (!password.value.length) {
    passwordErrorMessage.value = "Le mot de passe ne peut pas être vide"
    return false
  }

  passwordErrorMessage.value = ""
  console.log("### is valid")

  return true
})
const submit = () => {
  console.log("submit", email.value, password.value)
  userStore.login(email.value, password.value)
}
</script>

<template>
  <div class="is-flex flex-center">
    <div class="sm-container">
      <h1>Connexion</h1>
      <DsfrInputGroup
        :error-message="emailErrorMessage"
        :is-invalid="!isMailValid"
        :label-visible="true"
        :model-value="email"
        label="courriel"
        placeholder="jean@fournisseur.fr"
        @update:model-value="onEmailUpdate"
      />
      <DsfrInput
        :error-message="passwordErrorMessage"
        :is-invalid="!isPasswordValid"
        :label-visible="true"
        :model-value="password"
        label="mot de passe"
        placeholder="******"
        type="password"
        @update:model-value="onPasswordUpdate"
      />
      <DsfrButton
        :disabled="loadingStore.isLoading('authLogin')"
        class="fr-my-2w"
        label="Connexion"
        @click="submit"
      />
    </div>
  </div>
</template>
