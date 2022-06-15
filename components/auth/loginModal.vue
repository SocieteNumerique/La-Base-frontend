<template>
  <DsfrModal
    :actions="actions"
    title="Connexion"
    :opened="true"
    @close="emit('close')"
  >
    <div class="is-flex flex-center">
      <div class="sm-container">
        <template v-if="isForgottenEmailScreen">
          <DsfrInputGroup
            :error-message="emailErrorMessage"
            :is-invalid="!isMailValid"
            :label-visible="true"
            :model-value="email"
            label="Courriel"
            placeholder="jean@fournisseur.fr"
            @update:model-value="onEmailUpdate"
          />
          <p>
            Si cette adresse existe dans notre base de donnée, nous vous
            enverrons un courriel avec un lien permettant de modifier votre mot
            de passe.
          </p>
        </template>
        <template v-else>
          <DsfrInputGroup
            :error-message="emailErrorMessage"
            :is-invalid="!isMailValid"
            :label-visible="true"
            :model-value="email"
            label="Courriel"
            placeholder="jean@fournisseur.fr"
            @update:model-value="onEmailUpdate"
          />
          <DsfrInput
            :error-message="passwordErrorMessage"
            :is-invalid="!isPasswordValid"
            :label-visible="true"
            :model-value="password"
            label="Mot de passe"
            placeholder="******"
            type="password"
            @update:model-value="onPasswordUpdate"
          />
          <div style="text-align: right" class="fr-mt-2w">
            <DsfrButton
              label="Mot de passe oublié ?"
              class="fr-btn--tertiary-no-outline"
              @click="isForgottenEmailScreen = true"
            />
          </div>
        </template>
      </div>
    </div>
  </DsfrModal>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useLoadingStore } from "~/stores/loadingStore"
import { DsfrModal } from "@laruiss/vue-dsfr"

const isForgottenEmailScreen = ref(false)
const email = ref("")
const isEmailUntouched = ref(true)
const isPasswordUntouched = ref(true)
const emailErrorMessage = ref("")
const passwordErrorMessage = ref("")
const password = ref("")
const userStore = useUserStore()
const loadingStore = useLoadingStore()

const emit = defineEmits(["close"])
const actions = computed(() => [
  {
    label: isForgottenEmailScreen.value ? "Récupérer mon accès" : "Connexion",
    onClick: submit,
    disabled:
      !isFormValid.value ||
      loadingStore.isLoading("authLogin") ||
      loadingStore.isLoading("passwordReset"),
  },
  { label: "Annuler", onClick: () => emit("close"), secondary: true },
])

const isFormValid = computed(() => {
  if (isForgottenEmailScreen) {
    return isMailValid.value
  }
  return isMailValid.value && isPasswordValid.value
})
const onEmailUpdate = (value: string) => {
  isEmailUntouched.value = false
  email.value = value
}
const onPasswordUpdate = (value: string) => {
  isPasswordUntouched.value = false
  password.value = value
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

  if (!password.value.length) {
    passwordErrorMessage.value = "Le mot de passe ne peut pas être vide"
    return false
  }

  passwordErrorMessage.value = ""
  return true
})
const submit = async () => {
  console.log("submit", email.value, password.value)
  if (isForgottenEmailScreen.value) {
    await userStore.resetPassword(email.value)
  } else {
    await userStore.login(email.value, password.value)
  }
  emit("close")
}
</script>
