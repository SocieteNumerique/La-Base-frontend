<template>
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
          Si cette adresse existe dans notre base de donnée, nous vous enverrons
          un courriel avec un lien permettant de modifier votre mot de passe.
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
          <template v-if="isEmailNotValidated">
            <DsfrButton
              label="Renvoyer le lien de confirmation"
              class="fr-btn--tertiary-no-outline"
              @click="resendConfirmationEmail"
            />
          </template>
          <template v-else>
            <DsfrButton
              label="Mot de passe oublié ?"
              class="fr-btn--tertiary-no-outline"
              @click="isForgottenEmailScreen = true"
            />
          </template>
        </div>
      </template>
      <div class="is-flex fr-mt-3w" style="flex-direction: row-reverse">
        <DsfrButton
          :label="isForgottenEmailScreen ? 'Récupérer mon accès' : 'Connexion'"
          :disabled="isFormDisabled"
          class="fr-ml-3w"
          @click="submit"
        />
        <DsfrButton label="Annuler" secondary @click="emit('close')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useLoadingStore } from "~/stores/loadingStore"
import { useRouter } from "vue-router"

const isForgottenEmailScreen = ref(false)
const email = ref("")
const isEmailUntouched = ref(true)
const isPasswordUntouched = ref(true)
const emailErrorMessage = ref("")
const passwordErrorMessage = ref("")
const password = ref("")
const userStore = useUserStore()
const loadingStore = useLoadingStore()
const isEmailNotValidated = ref(false)
const router = useRouter()

const emit = defineEmits(["close", "done"])

onMounted(() => {
  if (userStore.prefillEmail) {
    email.value = userStore.prefillEmail
    isEmailUntouched.value = false
  }
})

const isFormValid = computed(() => {
  if (isForgottenEmailScreen.value) {
    return isMailValid.value
  }
  return (
    !isEmailUntouched.value &&
    !isPasswordUntouched.value &&
    isMailValid.value &&
    isPasswordValid.value
  )
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

const isFormDisabled = computed(() => {
  return (
    !isFormValid.value ||
    loadingStore.isLoading("authLogin") ||
    loadingStore.isLoading("passwordReset")
  )
})

const submit = async () => {
  if (isForgottenEmailScreen.value) {
    const { data, error } = await userStore.resetPassword(email.value)
    if (!error.value) {
      emit("done")
    }
  } else {
    const { data, error } = await userStore.login(email.value, password.value)
    if (error.value) {
      const statusCode = error.value.message.substring(0, 3)
      if (statusCode == "403") {
        isEmailNotValidated.value = true
      }
    } else {
      router.replace({
        query: { ...useRoute().query, update: new Date().getMilliseconds() },
      })
      emit("done")
    }
  }
}

const resendConfirmationEmail = () => {
  if (email.value) {
    userStore.resendConfirmationEmail(email.value)
  }
}
</script>
